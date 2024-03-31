import {AppState} from "../models/domain/app_state";
import {AppStateAction} from "../models/actions/app/app_state_action";
import {Page} from "../models/domain/page";
import {isUpdateMatchAction} from "../models/actions/app/update_match_action";
import {isReturnHomeAction} from "../models/actions/app/return_home_action";
import {isIngestMoveAction} from "../models/actions/app/ingest_move_action";
import {isUpdateChallengeAction} from "../models/actions/app/update_challenge_action";
import {isUpdateAuthAction} from "../models/actions/app/update_auth_action";
import {AuthKeyset} from "../models/domain/auth_keyset";
import {Throwable} from "../types";
import {MatchResult} from "../models/domain/match_result";


export const appStateReducer = (curr: AppState, action: AppStateAction): Throwable<AppState> => {
    if (isUpdateAuthAction(action)) {
        return new AppState({
            ...curr,
            auth: new AuthKeyset({
                publicKey: action.payload.publicKey,
                privateKey: action.payload.privateKey,
            }),
        });
    } else if (isUpdateMatchAction(action)) {
        const newMatch = action.payload.newMatch;
        if (newMatch) {
            return new AppState({
                ...curr,
                page: Page.MATCH,
                match: newMatch,
            });
        } else {
            return new AppState({
                ...curr,
                page: Page.HOME,
                match: newMatch,
            });
        }
    } else if (isUpdateChallengeAction(action)) {
        if (!curr.auth) {
            throw new Error("Cannot update challenge without auth");
        }

        const {newChallenge} = action.payload;
        if (newChallenge.isInbound(curr.auth)) {
            for (let i = 0; i < curr.inboundChallenges.length; i++) {
                if (curr.inboundChallenges[i].uuid === newChallenge.uuid) {
                    if (newChallenge.isActive) {
                        const newInboundChallenges = [...curr.inboundChallenges];
                        newInboundChallenges[i] = newChallenge;
                        return new AppState({
                            ...curr,
                            inboundChallenges: newInboundChallenges,
                        });
                    } else {
                        const newInboundChallenges = [
                            ...curr.inboundChallenges.slice(0, i),
                            ...curr.inboundChallenges.slice(i + 1)
                        ];
                        return new AppState({
                            ...curr,
                            inboundChallenges: newInboundChallenges,
                        });
                    }
                }
            }
            if (newChallenge.isActive) {
                return new AppState({
                    ...curr,
                    inboundChallenges: [...curr.inboundChallenges, newChallenge],
                });
            } else {
                return new AppState(curr);
            }
        } else {
            for (let i = 0; i < curr.outboundChallenges.length; i++) {
                if (curr.outboundChallenges[i].uuid === newChallenge.uuid) {
                    if (newChallenge.isActive) {
                        const newOutboundChallenges = [...curr.outboundChallenges];
                        newOutboundChallenges[i] = newChallenge;
                        return new AppState({
                            ...curr,
                            outboundChallenges: newOutboundChallenges,
                        });
                    } else {
                        const newOutboundChallenges = [
                            ...curr.outboundChallenges.slice(0, i),
                            ...curr.outboundChallenges.slice(i + 1)
                        ];
                        return new AppState({
                            ...curr,
                            outboundChallenges: newOutboundChallenges,
                        });
                    }
                }
            }
            if (newChallenge.isActive) {
                return new AppState({
                    ...curr,
                    outboundChallenges: [...curr.outboundChallenges, newChallenge],
                });
            } else {
                return new AppState(curr);
            }
        }
    } else if (isIngestMoveAction(action)) {
        return new AppState({
            ...curr,
            lastMove: action.payload.move,
        });
    } else if (isReturnHomeAction(action)) {
        if (curr.match && curr.match.result === MatchResult.IN_PROGRESS) {
            return curr;
        }

        return new AppState({
            ...curr,
            page: Page.HOME,
            match: null,
        });
    }
    throw new Error(`Uncaught action type: ${action.type}`);
}
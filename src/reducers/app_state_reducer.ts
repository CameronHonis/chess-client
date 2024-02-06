import {AppState} from "../models/domain/app_state";
import {AppStateAction} from "../models/actions/app_state_action";
import {Page} from "../models/domain/page";
import {isUpdateMatchAction} from "../models/actions/update_match_action";
import {isReturnHomeAction} from "../models/actions/return_home_action";
import {isIngestMoveAction} from "../models/actions/ingest_move_action";
import {isUpdateChallengeAction} from "../models/actions/update_challenge_action";
import {isUpdateAuthAction} from "../models/actions/update_auth_action";
import {AuthKeyset} from "../models/domain/auth_keyset";


export const appStateReducer = (curr: AppState, action: AppStateAction): AppState => {
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
        if (newMatch && !newMatch.board.isTerminal) {
            return new AppState({
                ...curr,
                page: Page.BOARD,
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
        const {newChallenge, isInbound} = action.payload;
        if (isInbound) {
            for (let i = 0; i < curr.inboundChallenges.length; i++) {
                if (curr.inboundChallenges[i].uuid === newChallenge.uuid) {
                    const newInboundChallenges = [...curr.inboundChallenges];
                    newInboundChallenges[i] = newChallenge;
                    return new AppState({
                        ...curr,
                        inboundChallenges: newInboundChallenges,
                    });
                }
            }
            return new AppState({
                ...curr,
                inboundChallenges: [...curr.inboundChallenges, newChallenge],
            });
        } else {
            for (let i = 0; i < curr.outboundChallenges.length; i++) {
                if (curr.outboundChallenges[i].uuid === newChallenge.uuid) {
                    const newOutboundChallenges = [...curr.outboundChallenges];
                    newOutboundChallenges[i] = newChallenge;
                    return new AppState({
                        ...curr,
                        outboundChallenges: newOutboundChallenges,
                    });

                }
            }
            return new AppState({
                ...curr,
                outboundChallenges: [...curr.outboundChallenges, newChallenge],
            });
        }
    } else if (isIngestMoveAction(action)) {
        return new AppState({
            ...curr,
            lastMove: action.payload.move,
        });
    } else if (isReturnHomeAction(action)) {
        if (curr.match && !curr.match.board.isTerminal) {
            throw new Error("Cannot return home while match is in progress");
        }
        return new AppState({
            ...curr,
            page: Page.HOME,
            match: null,
        });
    }
    throw new Error(`Uncaught action type: ${action.type}`);
}
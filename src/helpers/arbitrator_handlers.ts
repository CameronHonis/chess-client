import React from "react";
import {UpdateMatchAction} from "../models/actions/update_match_action";
import {AppStateAction} from "../models/actions/app_state_action";
import {IngestMoveAction} from "../models/actions/ingest_move_action";
import {parseEventName} from "../models/events/message_event_name";
import {AuthKeyset} from "../models/domain/auth_keyset";
import {dispatchErr} from "../models/events/notif_event";
import {Square} from "../models/domain/square";
import {Move} from "../models/domain/move";
import {Match} from "../models/domain/match";
import {MessageContentType} from "../models/api/messages/message_content_type";
import {UpdateAuthAction} from "../models/actions/update_auth_action";
import {UpdateChallengeAction} from "../models/actions/update_challenge_action";
import {Challenge} from "../models/domain/challenge";

export function registerOnAuthMsgHandler(dispatch: React.Dispatch<AppStateAction>) {
    document.addEventListener(parseEventName(MessageContentType.AUTH), (e) => {
        const content = e.detail.msg.content
        const keyset: AuthKeyset = new AuthKeyset({
            publicKey: content.publicKey,
            privateKey: content.privateKey,
        });
        dispatch(new UpdateAuthAction(keyset.publicKey, keyset.privateKey));
    });
}

export function registerOnMatchUpdatedMsgHandler(dispatch: React.Dispatch<AppStateAction>) {
    document.addEventListener(parseEventName(MessageContentType.MATCH_UPDATED), (e) => {
        const apiMatch = e.detail.msg.content.match;
        const domainMatch = Match.fromApi(apiMatch);
        dispatch(new UpdateMatchAction(domainMatch));
    });
}

export function registerOnMoveMsgHandler(dispatch: React.Dispatch<AppStateAction>) {
    document.addEventListener(parseEventName(MessageContentType.MOVE), (e) => {
        const move = e.detail.msg.content.move;
        window.services.boardAnimator.movePiece(Square.fromApi(move.startSquare), Square.fromApi(move.endSquare));
        dispatch(new IngestMoveAction(Move.fromApi(move)));
    });
}

export function registerOnChallengeUpdatedMsgHandler(dispatch: React.Dispatch<AppStateAction>) {
    document.addEventListener(parseEventName(MessageContentType.CHALLENGE_UPDATED), (e) => {
        const apiChallenge = e.detail.msg.content.challenge;
        dispatch(new UpdateChallengeAction(Challenge.fromApi(apiChallenge)));
    });
}

export function registerOnChallengeFailedMsgHandler() {
    document.addEventListener(parseEventName(MessageContentType.CHALLENGE_REQUEST_FAILED), (e) => {
        const reason = e.detail.msg.content.reason;
        dispatchErr(`challenge request failed: ${reason}`);
    });
}
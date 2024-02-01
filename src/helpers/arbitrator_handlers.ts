import React from "react";
import {MessageContentType} from "../models/messages/message_content_type";
import {MatchUpdateReceived} from "../models/actions/match_update_received";
import {AppStateAction} from "../models/actions/app_state_action";
import {MoveReceived} from "../models/actions/move_received";
import {parseEventName} from "../models/events/message_event_name";
import {AuthKeyset} from "../services/auth_manager";
import {dispatchErr} from "../models/events/notif_event";
import {Square} from "../models/domain/square";
import {Move} from "../models/domain/move";
import {Match} from "../models/domain/match";

export function registerOnAuthMsg() {
    document.addEventListener(parseEventName(MessageContentType.AUTH), (e) => {
        const content = e.detail.msg.content
        const keyset: AuthKeyset = {
            publicKey: content.publicKey,
            privateKey: content.privateKey,
        }
        window.services.authManager.setArbitratorKeyset(keyset);
    });
}

export function registerOnMatchUpdatedMsg(dispatch: React.Dispatch<AppStateAction>) {
    document.addEventListener(parseEventName(MessageContentType.MATCH_UPDATED), (e) => {
        const newMatch = e.detail.msg.content.match;
        dispatch(new MatchUpdateReceived(Match.fromApi(newMatch)));
    });
}

export function registerOnMoveMsg(dispatch: React.Dispatch<AppStateAction>) {
    document.addEventListener(parseEventName(MessageContentType.MOVE), (e) => {
        const move = e.detail.msg.content.move;
        window.services.boardAnimator.movePiece(Square.fromApi(move.startSquare), Square.fromApi(move.endSquare));
        dispatch(new MoveReceived(Move.fromApi(move)));
    });
}

export function registerOnChallengeFailed() {
    document.addEventListener(parseEventName(MessageContentType.CHALLENGE_REQUEST_FAILED), (e) => {
        const reason = e.detail.msg.content.reason;
        dispatchErr(`challenge request failed: ${reason}`);
    });
}
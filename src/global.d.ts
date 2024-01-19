import {ArbitratorClient} from "./services/arbitrator_client";
import {AuthManager} from "./services/auth_manager";
import {MessageEventPayload} from "./models/events/message_event";
import {MessageContentType} from "./models/enums/message_content_type";
import {MessageEventName} from "./models/enums/message_event_name";
import {Timer} from "./services/timer";
import {AppState} from "./models/state/app_state";
import {AppStateAction} from "./models/actions/app_state_action";
import React from "react";
import {BoardAnimator} from "./services/board_animator";

interface ArbitratorMessageEventMap {
    [MessageEventName.EMPTY]: MessageEventPayload<MessageContentType.EMPTY>;
    [MessageEventName.AUTH]: MessageEventPayload<MessageContentType.AUTH>;
    [MessageEventName.FIND_MATCH]: MessageEventPayload<MessageContentType.FIND_MATCH>;
    [MessageEventName.MATCH_UPDATE]: MessageEventPayload<MessageContentType.MATCH_UPDATE>;
    [MessageEventName.MOVE]: MessageEventPayload<MessageContentType.MOVE>;
    [MessageEventName.SUBSCRIBE_REQUEST]: MessageEventPayload<MessageContentType.SUBSCRIBE_REQUEST>;
    [MessageEventName.SUBSCRIBE_REQUEST_GRANTED]: MessageEventPayload<MessageContentType.SUBSCRIBE_REQUEST_GRANTED>;
    [MessageEventName.SUBSCRIBE_REQUEST_DENIED]: MessageEventPayload<MessageContentType.SUBSCRIBE_REQUEST_DENIED>;
    [MessageEventName.ECHO]: MessageEventPayload<MessageContentType.ECHO>;
    [MessageEventName.UPGRADE_AUTH_REQUEST]: MessageEventPayload<MessageContentType.UPGRADE_AUTH_REQUEST>;
    [MessageEventName.UPGRADE_AUTH_GRANTED]: MessageEventPayload<MessageContentType.UPGRADE_AUTH_GRANTED>;
    [MessageEventName.UPGRADE_AUTH_DENIED]: MessageEventPayload<MessageContentType.UPGRADE_AUTH_DENIED>;
    [MessageEventName.CHALLENGE_REQUEST]: MessageEventPayload<MessageContentType.CHALLENGE_REQUEST>;
    [MessageEventName.CHALLENGE_REQUEST_FAILED]: MessageEventPayload<MessageContentType.CHALLENGE_REQUEST_FAILED>;
    [MessageEventName.CHALLENGE_REQUEST_ACCEPTED]: MessageEventPayload<MessageContentType.CHALLENGE_REQUEST_ACCEPTED>;
    [MessageEventName.CHALLENGE_REQUEST_DENIED]: MessageEventPayload<MessageContentType.CHALLENGE_REQUEST_DENIED>;
    [MessageEventName.CHALLENGE_REQUEST_REVOKED]: MessageEventPayload<MessageContentType.CHALLENGE_REQUEST_REVOKED>;
    [MessageEventName.MATCH_CREATION_FAILED]: MessageEventPayload<MessageContentType.MATCH_CREATION_FAILED>;
}

declare global {
    interface Document {
        addEventListener<K extends keyof ArbitratorMessageEventMap>(type: K, listener: (this: HTMLElement, ev: CustomEvent<ArbitratorMessageEventMap[K]>) => void): void;

        dispatchEvent<K extends keyof ArbitratorMessageEventMap>(ev: CustomEvent<ArbitratorMessageEventMap[K]>): void;

        removeEventListener<K extends keyof ArbitratorMessageEventMap>(type: K, listener: (this: HTMLElement, ev: CustomEvent<ArbitratorMessageEventMap[K]>) => void): void;
    }

    interface Window {
        appState: AppState;
        appDispatch: React.Dispatch<AppStateAction>;
        services: {
            authManager: AuthManager;
            arbitratorClient: ArbitratorClient;
            timer: Timer;
            boardAnimator: BoardAnimator
        }
    }
}
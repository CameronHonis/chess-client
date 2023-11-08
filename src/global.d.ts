import {ArbitratorClient} from "./services/arbitrator_client";
import {AuthManager} from "./services/auth_manager";
import {MessageEventPayload} from "./models/events/message_event";
import {MessageContentType} from "./models/enums/message_content_type";
import {MessageEventName} from "./models/enums/message_event_name";
import {Timer} from "./services/timer";

interface ArbitratorMessageEventMap {
    [MessageEventName.EMPTY]: MessageEventPayload<MessageContentType.EMPTY>;
    [MessageEventName.AUTH]: MessageEventPayload<MessageContentType.AUTH>;
    [MessageEventName.FIND_BOT_MATCH]: MessageEventPayload<MessageContentType.FIND_BOT_MATCH>;
    [MessageEventName.FIND_MATCH]: MessageEventPayload<MessageContentType.FIND_MATCH>;
    [MessageEventName.MATCH_UPDATE]: MessageEventPayload<MessageContentType.MATCH_UPDATE>;
    [MessageEventName.MOVE]: MessageEventPayload<MessageContentType.MOVE>;
    [MessageEventName.SUBSCRIBE_REQUEST]: MessageEventPayload<MessageContentType.SUBSCRIBE_REQUEST>;
    [MessageEventName.SUBSCRIBE_REQUEST_GRANTED]: MessageEventPayload<MessageContentType.SUBSCRIBE_REQUEST_GRANTED>;
    [MessageEventName.SUBSCRIBE_REQUEST_DENIED]: MessageEventPayload<MessageContentType.SUBSCRIBE_REQUEST_DENIED>;
    [MessageEventName.FIND_BOT_MATCH_NO_BOTS]: MessageEventPayload<MessageContentType.FIND_BOT_MATCH_NO_BOTS>;
    [MessageEventName.ECHO]: MessageEventPayload<MessageContentType.ECHO>;
    [MessageEventName.UPGRADE_AUTH_REQUEST]: MessageEventPayload<MessageContentType.UPGRADE_AUTH_REQUEST>;
    [MessageEventName.UPGRADE_AUTH_GRANTED]: MessageEventPayload<MessageContentType.UPGRADE_AUTH_GRANTED>;
    [MessageEventName.UPGRADE_AUTH_DENIED]: MessageEventPayload<MessageContentType.UPGRADE_AUTH_DENIED>;
    [MessageEventName.CONTENT_TYPE_INIT_BOT_MATCH_SUCCESS]: MessageEventPayload<MessageContentType.INIT_BOT_MATCH_SUCCESS>;
    [MessageEventName.CONTENT_TYPE_INIT_BOT_MATCH_FAILURE]: MessageEventPayload<MessageContentType.INIT_BOT_MATCH_FAILURE>;
}

declare global {
    interface Document {
        addEventListener<K extends keyof ArbitratorMessageEventMap>(type: K, listener: (this: HTMLElement, ev: CustomEvent<ArbitratorMessageEventMap[K]>) => void): void;

        dispatchEvent<K extends keyof ArbitratorMessageEventMap>(ev: CustomEvent<ArbitratorMessageEventMap[K]>): void;

        removeEventListener<K extends keyof ArbitratorMessageEventMap>(type: K, listener: (this: HTMLElement, ev: CustomEvent<ArbitratorMessageEventMap[K]>) => void): void;
    }

    interface Window {
        services: {
            authManager: AuthManager;
            arbitratorClient: ArbitratorClient;
            timer: Timer;
        }
    }
}
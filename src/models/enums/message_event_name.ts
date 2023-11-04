import {MessageContentType} from "./message_content_type";

export enum MessageEventName {
    EMPTY = "message-EMPTY",
    AUTH = "message-AUTH",
    FIND_BOT_MATCH = "message-FIND_BOT_MATCH",
    FIND_MATCH = "message-FIND_MATCH",
    MATCH_UPDATE = "message-MATCH_UPDATE",
    MOVE = "message-MOVE",
    SUBSCRIBE_REQUEST = "message-SUBSCRIBE_REQUEST",
    SUBSCRIBE_REQUEST_GRANTED = "message-SUBSCRIBE_REQUEST_GRANTED",
    SUBSCRIBE_REQUEST_DENIED = "message-SUBSCRIBE_REQUEST_DENIED",
    FIND_BOT_MATCH_NO_BOTS = "message-FIND_BOT_MATCH_NO_BOTS",
    ECHO = "message-ECHO",
    UPGRADE_AUTH_REQUEST = "message-UPGRADE_AUTH_REQUEST",
    UPGRADE_AUTH_GRANTED = "message-UPGRADE_AUTH_GRANTED",
    UPGRADE_AUTH_DENIED = "message-UPGRADE_AUTH_DENIED",
    CONTENT_TYPE_INIT_BOT_MATCH_SUCCESS = "message-INIT_BOT_MATCH_SUCCESS",
    CONTENT_TYPE_INIT_BOT_MATCH_FAILURE = "message-INIT_BOT_MATCH_FAILURE",
};

export function parseEventName(contentType: MessageContentType): MessageEventName {
    const messageEventName = `message-${contentType}`;
    if (isMessageEventName(messageEventName)) {
        return messageEventName;
    } else {
        throw new Error(`could not map contentType ${contentType} to event name`);
    }
}

export function isMessageEventName(name: string): name is MessageEventName {
    return Object.values(MessageEventName).includes(name as MessageEventName);
}

import {MessageContentType} from "./message_content_type";

export enum MessageEventName {
    EMPTY = "message-EMPTY",
    AUTH = "message-AUTH",
    FIND_MATCH = "message-FIND_MATCH",
    MATCH_UPDATE = "message-MATCH_UPDATE",
    MOVE = "message-MOVE",
    SUBSCRIBE_REQUEST = "message-SUBSCRIBE_REQUEST",
    SUBSCRIBE_REQUEST_GRANTED = "message-SUBSCRIBE_REQUEST_GRANTED",
    SUBSCRIBE_REQUEST_DENIED = "message-SUBSCRIBE_REQUEST_DENIED",
    ECHO = "message-ECHO",
    UPGRADE_AUTH_REQUEST = "message-UPGRADE_AUTH_REQUEST",
    UPGRADE_AUTH_GRANTED = "message-UPGRADE_AUTH_GRANTED",
    UPGRADE_AUTH_DENIED = "message-UPGRADE_AUTH_DENIED",
    CHALLENGE_REQUEST = "message-CHALLENGE_REQUEST",
    CHALLENGE_REQUEST_FAILED = "message-CHALLENGE_REQUEST_FAILED",
    CHALLENGE_REQUEST_ACCEPTED = "message-CHALLENGE_REQUEST_ACCEPTED",
    CHALLENGE_REQUEST_DENIED = "message-CHALLENGE_REQUEST_DENIED",
    CHALLENGE_REQUEST_REVOKED = "message-CHALLENGE_REQUEST_REVOKED",
    MATCH_CREATION_FAILED = "message-MATCH_CREATION_FAILED",
}

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

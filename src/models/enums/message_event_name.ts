import {MessageContentType} from "./message_content_type";

export type MessageEventName = `message-${MessageContentType}`;

export function parseEventName(contentType: MessageContentType): MessageEventName {
    const messageEventName = `message-${contentType}`;
    if (isMessageEventName(messageEventName)) {
        return messageEventName;
    } else {
        throw new Error(`could not map contentType ${contentType} to event name`);
    }
}

export function isMessageEventName(name: string): name is MessageEventName {
    if (!name.startsWith("message-")) {
        return false
    }
    const contentName = name.substring("message-".length) as MessageContentType;
    return Object.values(MessageContentType).includes(contentName);
}

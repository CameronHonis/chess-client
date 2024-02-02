import {MessageContentType} from "../api/messages/message_content_type";

export type MessageEventName<CT extends keyof typeof MessageContentType> = `message-${CT}`;

export function parseEventName<CT extends keyof typeof MessageContentType>(contentType: CT): MessageEventName<CT> {
    const messageEventName = `message-${contentType}`;
    if (isMessageEventName(messageEventName)) {
        return messageEventName as MessageEventName<CT>;
    } else {
        throw new Error(`could not map contentType ${contentType} to event name`);
    }
}

export function isMessageEventName(name: string): name is MessageEventName<keyof typeof MessageContentType> {
    if (!name.startsWith("message-")) {
        return false
    }
    const contentName = name.substring("message-".length) as MessageContentType;
    return Object.values(MessageContentType).includes(contentName);
}

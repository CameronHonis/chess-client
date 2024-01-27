import {ArbitratorMessage} from "../messages/arbitrator_message";
import {MessageContentType} from "../messages/message_content_type";

export interface MessageEventPayload<CT extends keyof typeof MessageContentType> {
    msg: ArbitratorMessage<CT>
}

export type InboundArbitratorMessage<CT extends keyof typeof MessageContentType> = CustomEvent<MessageEventPayload<CT>>;
import {MessageContentType} from "../api/messages/message_content_type";
import {ArbitratorMessage} from "../api/messages/arbitrator_message";

export interface ArbitratorMessageEventPayload<CT extends MessageContentType> {
    msg: ArbitratorMessage<CT>
}

export type ArbitratorMessageEvent<CT extends MessageContentType> = CustomEvent<ArbitratorMessageEventPayload<CT>>;
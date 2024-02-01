import {ArbitratorMessage} from "../messages/arbitrator_message";
import {MessageContentType} from "../messages/message_content_type";

export interface ArbitratorMessageEventPayload<CT extends MessageContentType> {
    msg: ArbitratorMessage<CT>
}

export type ArbitratorMessageEvent<CT extends MessageContentType> = CustomEvent<ArbitratorMessageEventPayload<CT>>;
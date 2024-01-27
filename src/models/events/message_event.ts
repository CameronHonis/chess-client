import {ArbitratorMessage} from "../messages/arbitrator_message";
import {MessageContentType} from "../enums/message_content_type";

export interface MessageEventPayload<CT extends keyof typeof MessageContentType> {
    msg: ArbitratorMessage<CT>
}
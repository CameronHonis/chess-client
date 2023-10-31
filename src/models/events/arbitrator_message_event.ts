import {ArbitratorMessage} from "../messages/arbitrator_message";
import {MessageContentType} from "../enums/message_content_type";

export interface ArbitratorMessageEvent<CT extends MessageContentType> extends CustomEvent {
    msg: ArbitratorMessage<CT>
}

import {MessageContentType} from "../enums/message_content_type";

interface ArbitratorMessageArgs<CT extends MessageContentType> {
    topic: string
    contentType: CT
    content: any
    senderKey: string
    privateKey: string
}

export class ArbitratorMessage<CT extends MessageContentType> {
    topic: string
    contentType: CT
    content: ArbitratorMessageContentTypeToContentMap[CT]
    senderKey: string
    privateKey: string

    constructor(args: ArbitratorMessageArgs<CT>) {
        this.topic = args.topic;
        this.contentType = args.contentType;
        this.content = args.content;
        this.senderKey = args.senderKey;
        this.privateKey = args.privateKey;
    }
}

export interface ArbitratorMessageContentTypeToContentMap {
    "AUTH": ArbitratorMessageContentAuth
}

export interface ArbitratorMessageContentAUTH {
    publicKey: string;
    privateKey: string;
}

export interface ArbitratorMessageContentEMPTY {

}

export interface ArbitratorMessageContentFIND_BOT_MATCH {

}
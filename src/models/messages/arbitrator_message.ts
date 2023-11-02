import {MessageContentType} from "../enums/message_content_type";
import {
    AuthArbitratorMessageContent,
    EchoArbitratorMessageContent,
    EmptyArbitratorMessageContent, FindBotMatchArbitratorMessageContent,
    FindBotMatchNoBotsArbitratorMessageContent, FindMatchArbitratorMessageContent,
    MatchUpdateArbitratorMessageContent,
    MoveArbitratorMessageContent,
    SubscribeRequestArbitratorMessageContent,
    SubscribeRequestDeniedArbitratorMessageContent,
    UpgradeAuthDeniedArbitratorMessageContent,
    UpgradeAuthGrantedArbitratorMessageContent,
    UpgradeAuthRequestArbitratorMessageContent
} from "./message_content";

interface ArbitratorMessageArgs<CT extends keyof typeof MessageContentType> {
    topic: string
    contentType: CT
    content: ArbitratorMessageContentTypeToContentMap[CT]
    senderKey: string
    privateKey: string
}

export class ArbitratorMessage<CT extends keyof typeof MessageContentType> {
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
    "EMPTY": EmptyArbitratorMessageContent,
    "AUTH": AuthArbitratorMessageContent,
    "FIND_BOT_MATCH": FindBotMatchArbitratorMessageContent,
    "FIND_MATCH": FindMatchArbitratorMessageContent,
    "MATCH_UPDATE": MatchUpdateArbitratorMessageContent,
    "MOVE": MoveArbitratorMessageContent,
    "SUBSCRIBE_REQUEST": SubscribeRequestArbitratorMessageContent,
    "SUBSCRIBE_REQUEST_DENIED": SubscribeRequestDeniedArbitratorMessageContent,
    "FIND_BOT_MATCH_NO_BOTS": FindBotMatchNoBotsArbitratorMessageContent,
    "ECHO": EchoArbitratorMessageContent,
    "UPGRADE_AUTH_REQUEST": UpgradeAuthRequestArbitratorMessageContent,
    "UPGRADE_AUTH_GRANTED": UpgradeAuthGrantedArbitratorMessageContent,
    "UPGRADE_AUTH_DENIED": UpgradeAuthDeniedArbitratorMessageContent,
}


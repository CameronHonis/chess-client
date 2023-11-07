import {MessageContentType} from "../enums/message_content_type";
import {
    AuthMessageContent,
    EchoMessageContent,
    EmptyMessageContent,
    FindBotMatchMessageContent,
    FindBotMatchNoBotsMessageContent,
    FindMatchMessageContent, InitBotFailureMessageContent, InitBotSuccessMessageContent,
    MatchUpdateMessageContent,
    MoveMessageContent,
    SubscribeRequestDeniedMessageContent,
    SubscribeRequestGrantedMessageContent,
    SubscribeRequestMessageContent,
    UpgradeAuthDeniedMessageContent,
    UpgradeAuthGrantedMessageContent,
    UpgradeAuthRequestMessageContent
} from "./message_content";
import {isMessageEventName} from "../enums/message_event_name";
import {Throwable} from "../../types";
import {Match} from "../match";
import {BoardState} from "../board_state";
import {Move} from "../move";
import {Square} from "../square";

interface ArbitratorMessageArgs<CT extends keyof typeof MessageContentType> {
    topic: string
    contentType: CT
    content: MessageContentTypeToContentMap[CT]
    senderKey: string
    privateKey: string
}

export class ArbitratorMessage<CT extends keyof typeof MessageContentType> {
    topic: string
    contentType: CT
    content: MessageContentTypeToContentMap[CT]
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

export interface MessageContentTypeToContentMap {
    "EMPTY": EmptyMessageContent,
    "AUTH": AuthMessageContent,
    "FIND_BOT_MATCH": FindBotMatchMessageContent,
    "FIND_MATCH": FindMatchMessageContent,
    "MATCH_UPDATE": MatchUpdateMessageContent,
    "MOVE": MoveMessageContent,
    "SUBSCRIBE_REQUEST": SubscribeRequestMessageContent,
    "SUBSCRIBE_REQUEST_GRANTED": SubscribeRequestGrantedMessageContent,
    "SUBSCRIBE_REQUEST_DENIED": SubscribeRequestDeniedMessageContent,
    "FIND_BOT_MATCH_NO_BOTS": FindBotMatchNoBotsMessageContent,
    "ECHO": EchoMessageContent,
    "UPGRADE_AUTH_REQUEST": UpgradeAuthRequestMessageContent,
    "UPGRADE_AUTH_GRANTED": UpgradeAuthGrantedMessageContent,
    "UPGRADE_AUTH_DENIED": UpgradeAuthDeniedMessageContent,
    "INIT_BOT_MATCH_SUCCESS": InitBotSuccessMessageContent,
    "INIT_BOT_MATCH_FAILURE": InitBotFailureMessageContent,
}

export function parseMessageFromJsonObj(obj: Object): Throwable<ArbitratorMessage<MessageContentType>> {
    const contentType = parseContentType(obj);
    const eventName = `message-${contentType}`;
    if (!isMessageEventName(eventName)) {
        throw new Error(`event named ${eventName} does not map to a MessageEventName`);
    }
    const msg = new ArbitratorMessage(obj as ArbitratorMessageArgs<typeof contentType>);
    msg.content = parseContent(obj as Object & { contentType: MessageContentType });
    return msg;
}

export function parseContentType(obj: Object): Throwable<MessageContentType> {
    if (!("contentType" in obj)) {
        throw new Error("could not identify message contentType");
    }
    if (typeof obj["contentType"] !== "string") {
        throw new Error("contentType is not a string");
    }
    return obj["contentType"] as MessageContentType;
}

export function parseContent<CT extends MessageContentType>(
    obj: Object & { contentType: CT }): Throwable<MessageContentTypeToContentMap[CT]> {
    if (!("content" in obj)) {
        throw new Error("could not parse non-existent field 'content' on message");
    }
    let content = obj.content;
    switch (obj.contentType) {
        case MessageContentType.MATCH_UPDATE:
            const matchContent: MatchUpdateMessageContent = (content as MatchUpdateMessageContent);
            let enPassantSquare: Square | null = null;
            if (matchContent.match.board.enPassantSquare) {
                const squareJsonObj = matchContent.match.board.enPassantSquare;
                enPassantSquare = new Square(squareJsonObj.rank, squareJsonObj.file);
            }
            const board = new BoardState({...matchContent.match.board, enPassantSquare});
            matchContent.match = new Match({...matchContent.match, board});
            return matchContent as MessageContentTypeToContentMap[CT];
        case MessageContentType.MOVE:
            const moveContent: MoveMessageContent = (content as MoveMessageContent);
            const startSquare = new Square(moveContent.move.startSquare.rank, moveContent.move.startSquare.file);
            const endSquare = new Square(moveContent.move.endSquare.rank, moveContent.move.endSquare.file);
            let checkingSquares: Square[] = [];
            if (moveContent.move.kingCheckingSquares != null) {
                checkingSquares = moveContent.move.kingCheckingSquares.map(squareJson => {
                    return new Square(squareJson.rank, squareJson.file);
                });
            }
            moveContent.move = new Move(moveContent.move.piece, startSquare, endSquare, checkingSquares,
                moveContent.move.capturedPiece, moveContent.move.pawnUpgradedTo);
            return moveContent as MessageContentTypeToContentMap[CT];
        default:
            return content as MessageContentTypeToContentMap[CT];
    }
}

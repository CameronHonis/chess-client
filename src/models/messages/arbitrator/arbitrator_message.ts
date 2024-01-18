import {MessageContentType} from "../../enums/message_content_type";
import {isMessageEventName} from "../../enums/message_event_name";
import {Throwable} from "../../../types";
import {Match} from "../../match";
import {BoardState} from "../../board_state";
import {Move} from "../../move";
import {Square} from "../../square";
import {EmptyMessageContent} from "./contents/empty_message_content";
import {AuthMessageContent} from "./contents/auth_message_content";
import {FindMatchMessageContent} from "./contents/find_match_message_content";
import {MatchUpdateMessageContent} from "./contents/match_update_message_content";
import {MoveMessageContent} from "./contents/move_message_content";
import {SubscribeRequestMessageContent} from "./contents/subscribe_request_message_content";
import {SubscribeRequestGrantedMessageContent} from "./contents/subscribe_request_granted_message_content";
import {SubscribeRequestDeniedMessageContent} from "./contents/subscribe_request_denied_message_content";
import {EchoMessageContent} from "./contents/echo_message_content";
import {UpgradeAuthRequestMessageContent} from "./contents/upgrade_auth_request_message_content";
import {UpgradeAuthGrantedMessageContent} from "./contents/upgrade_auth_granted_message_content";
import {UpgradeAuthDeniedMessageContent} from "./contents/upgrade_auth_denied_message_content";
import {ChallengeMessageContent} from "./contents/challenge_message_content";
import {ChallengeRequestFailedMessageContent} from "./contents/challenge_request_failed_message_content";
import {ChallengeRequestAcceptedMessageContent} from "./contents/challenge_request_accepted_message_content";
import {ChallengeRequestDeniedMessageContent} from "./contents/challenge_request_denied_message_content";
import {ChallengeRequestRevokedMessageContent} from "./contents/challenge_request_revoked_message_content";
import {MatchCreationFailedMessageContent} from "./contents/match_creation_failed_message_content";

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
    "FIND_MATCH": FindMatchMessageContent,
    "MATCH_UPDATE": MatchUpdateMessageContent,
    "MOVE": MoveMessageContent,
    "SUBSCRIBE_REQUEST": SubscribeRequestMessageContent,
    "SUBSCRIBE_REQUEST_GRANTED": SubscribeRequestGrantedMessageContent,
    "SUBSCRIBE_REQUEST_DENIED": SubscribeRequestDeniedMessageContent,
    "ECHO": EchoMessageContent,
    "UPGRADE_AUTH_REQUEST": UpgradeAuthRequestMessageContent,
    "UPGRADE_AUTH_GRANTED": UpgradeAuthGrantedMessageContent,
    "UPGRADE_AUTH_DENIED": UpgradeAuthDeniedMessageContent,
    "CHALLENGE_REQUEST": ChallengeMessageContent,
    "CHALLENGE_REQUEST_FAILED": ChallengeRequestFailedMessageContent,
    "CHALLENGE_REQUEST_ACCEPTED": ChallengeRequestAcceptedMessageContent,
    "CHALLENGE_REQUEST_DENIED": ChallengeRequestDeniedMessageContent,
    "CHALLENGE_REQUEST_REVOKED": ChallengeRequestRevokedMessageContent,
    "MATCH_CREATION_FAILED": MatchCreationFailedMessageContent,
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

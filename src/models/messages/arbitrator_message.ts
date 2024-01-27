import {isMessageContentType, MessageContentType} from "./message_content_type";
import {Throwable} from "../../types";
import {Parser} from "../../helpers/parser";
import {MatchUpdateMessageContent} from "./arbitrator_contents/match_update_message_content";
import {ChallengeUpdatedMessageContent} from "./arbitrator_contents/challenge_updated_msg_content";
import {MoveFailedMessageContent} from "./arbitrator_contents/move_failed_message_content";
import {SubscribeRequestGrantedMessageContent} from "./arbitrator_contents/subscribe_request_granted_message_content";
import {SubscribeRequestDeniedMessageContent} from "./arbitrator_contents/subscribe_request_denied_message_content";
import {UpgradeAuthGrantedMessageContent} from "./arbitrator_contents/upgrade_auth_granted_message_content";
import {UpgradeAuthDeniedMessageContent} from "./arbitrator_contents/upgrade_auth_denied_message_content";
import {ChallengeRequestFailedMessageContent} from "./arbitrator_contents/challenge_request_failed_message_content";
import {MatchCreationFailedMessageContent} from "./arbitrator_contents/match_creation_failed_message_content";
import {EmptyMessageContent} from "./arbitrator_contents/empty_message_content";
import {EchoMessageContent} from "./arbitrator_contents/echo_message_content";
import {AuthMessageContent} from "./arbitrator_contents/auth_message_content";
import {FindMatchMessageContent} from "./arbitrator_contents/find_match_message_content";
import {MoveMessageContent} from "./arbitrator_contents/move_message_content";
import {SubscribeRequestMessageContent} from "./arbitrator_contents/subscribe_request_message_content";
import {UpgradeAuthRequestMessageContent} from "./arbitrator_contents/upgrade_auth_request_message_content";
import {RequestChallengeMessageContent} from "./arbitrator_contents/challenge_request_message_content";
import {AcceptChallengeMessageContent} from "./arbitrator_contents/challenge_request_accepted_message_content";
import {DeclineChallengeMessageContent} from "./arbitrator_contents/challenge_request_denied_message_content";
import {RevokeChallengeMessageContent} from "./arbitrator_contents/challenge_request_revoked_message_content";

export class ArbitratorMessage<CT extends keyof typeof MessageContentType> {
    topic: string
    contentType: CT
    content: InstanceType<ContentByContentType[CT]>
    senderKey: string
    privateKey: string

    constructor(args: ArbitratorMessage<CT>) {
        this.topic = args.topic;
        this.contentType = args.contentType;
        this.content = args.content;
        this.senderKey = args.senderKey;
        this.privateKey = args.privateKey;
    }
}

type ContentByContentType = {
    "MATCH_UPDATED": typeof MatchUpdateMessageContent,
    "CHALLENGE_UPDATED": typeof ChallengeUpdatedMessageContent,
    "MOVE_FAILED": typeof MoveFailedMessageContent,
    "SUBSCRIBE_REQUEST_GRANTED": typeof SubscribeRequestGrantedMessageContent,
    "SUBSCRIBE_REQUEST_DENIED": typeof SubscribeRequestDeniedMessageContent,
    "UPGRADE_AUTH_GRANTED": typeof UpgradeAuthGrantedMessageContent,
    "UPGRADE_AUTH_DENIED": typeof UpgradeAuthDeniedMessageContent,
    "CHALLENGE_REQUEST_FAILED": typeof ChallengeRequestFailedMessageContent,
    "MATCH_CREATION_FAILED": typeof MatchCreationFailedMessageContent,
    "EMPTY": typeof EmptyMessageContent,
    "ECHO": typeof EchoMessageContent,
    "AUTH": typeof AuthMessageContent,
    "FIND_MATCH": typeof FindMatchMessageContent,
    "MOVE": typeof MoveMessageContent,
    "SUBSCRIBE_REQUEST": typeof SubscribeRequestMessageContent,
    "UPGRADE_AUTH_REQUEST": typeof UpgradeAuthRequestMessageContent,
    "CHALLENGE_REQUEST": typeof RequestChallengeMessageContent,
    "ACCEPT_CHALLENGE": typeof AcceptChallengeMessageContent,
    "DECLINE_CHALLENGE": typeof DeclineChallengeMessageContent,
    "REVOKE_CHALLENGE": typeof RevokeChallengeMessageContent,
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const ContentByContentType: ContentByContentType = {
    [MessageContentType.MATCH_UPDATED]: MatchUpdateMessageContent,
    [MessageContentType.CHALLENGE_UPDATED]: ChallengeUpdatedMessageContent,
    [MessageContentType.MOVE_FAILED]: MoveFailedMessageContent,
    [MessageContentType.SUBSCRIBE_REQUEST_GRANTED]: SubscribeRequestGrantedMessageContent,
    [MessageContentType.SUBSCRIBE_REQUEST_DENIED]: SubscribeRequestDeniedMessageContent,
    [MessageContentType.UPGRADE_AUTH_GRANTED]: UpgradeAuthGrantedMessageContent,
    [MessageContentType.UPGRADE_AUTH_DENIED]: UpgradeAuthDeniedMessageContent,
    [MessageContentType.CHALLENGE_REQUEST_FAILED]: ChallengeRequestFailedMessageContent,
    [MessageContentType.MATCH_CREATION_FAILED]: MatchCreationFailedMessageContent,
    [MessageContentType.EMPTY]: EmptyMessageContent,
    [MessageContentType.ECHO]: EchoMessageContent,
    [MessageContentType.AUTH]: AuthMessageContent,
    [MessageContentType.FIND_MATCH]: FindMatchMessageContent,
    [MessageContentType.MOVE]: MoveMessageContent,
    [MessageContentType.SUBSCRIBE_REQUEST]: SubscribeRequestMessageContent,
    [MessageContentType.UPGRADE_AUTH_REQUEST]: UpgradeAuthRequestMessageContent,
    [MessageContentType.CHALLENGE_REQUEST]: RequestChallengeMessageContent,
    [MessageContentType.ACCEPT_CHALLENGE]: AcceptChallengeMessageContent,
    [MessageContentType.DECLINE_CHALLENGE]: DeclineChallengeMessageContent,
    [MessageContentType.REVOKE_CHALLENGE]: RevokeChallengeMessageContent,
}


export function parseMessageFromJson<T extends keyof typeof MessageContentType>(obj: {
    contentType: T
}): Throwable<ArbitratorMessage<T>> {
    if (!("contentType" in obj)) {
        throw new TypeError("could not identify message contentType");
    }
    if (typeof obj["contentType"] !== "string") {
        throw new TypeError(`property "contentType" is not a string, got type: ${typeof obj.contentType}`);
    }
    if (!isMessageContentType(obj.contentType)) {
        throw new TypeError(`property "contentType" unexpected variant, got: ${obj.contentType}`);
    }

    if (!("content" in obj)) {
        throw new TypeError(`property "content" expected to exist`);
    }
    if (typeof obj.content !== "object" || obj.content === null) {
        throw new TypeError(`property "content" expected to be an object, got type: ${typeof obj.content}`);
    }
    const targetCls = ContentByContentType[obj.contentType];
    const content = Parser.parseJson(obj.content, targetCls);

    if (!("topic" in obj)) {
        throw new TypeError(`property "topic" expected to exist`);
    }
    if (typeof obj.topic !== "string") {
        throw new TypeError(`property "topic" expected to be a string, got type: ${typeof obj.topic}`);
    }
    if (!("senderKey" in obj)) {
        throw new TypeError(`property "senderKey" expected to exist`);
    }
    if (typeof obj.senderKey !== "string") {
        throw new TypeError(`property "senderKey" expected to be a string, got type: ${typeof obj.senderKey}`);
    }
    if (!("privateKey" in obj)) {
        throw new TypeError(`property "privateKey" expected to exist`);
    }
    if (typeof obj.privateKey !== "string") {
        throw new TypeError(`property "privateKey" expected to be a string, got type: ${typeof obj.privateKey}`);
    }

    return new ArbitratorMessage<T>({
        topic: obj.topic,
        contentType: obj.contentType,
        content: content,
        senderKey: obj.senderKey,
        privateKey: obj.privateKey,
    });
}
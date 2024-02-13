import {isMessageContentType, MessageContentType} from "./message_content_type";
import {
    MatchUpdateMessageContent,
    MatchUpdateMessageContentSchema
} from "./arbitrator_contents/match_update_message_content";
import {
    ChallengeUpdatedMessageContent,
    ChallengeUpdatedMessageContentSchema
} from "./arbitrator_contents/challenge_updated_msg_content";
import {
    MoveFailedMessageContent,
    MoveFailedMessageContentSchema
} from "./arbitrator_contents/move_failed_message_content";
import {
    SubscribeRequestGrantedMessageContent,
    SubscribeRequestGrantedMessageContentSchema
} from "./arbitrator_contents/subscribe_request_granted_message_content";
import {
    SubscribeRequestDeniedMessageContent,
    SubscribeRequestDeniedMessageContentSchema
} from "./arbitrator_contents/subscribe_request_denied_message_content";
import {
    UpgradeAuthGrantedMessageContent,
    UpgradeAuthGrantedMessageContentSchema
} from "./arbitrator_contents/upgrade_auth_granted_message_content";
import {
    UpgradeAuthDeniedMessageContent,
    UpgradeAuthDeniedMessageContentSchema
} from "./arbitrator_contents/upgrade_auth_denied_message_content";
import {
    ChallengeRequestFailedMessageContent,
    ChallengeRequestFailedMessageContentSchema
} from "./arbitrator_contents/challenge_request_failed_message_content";
import {
    MatchCreationFailedMessageContent,
    MatchCreationFailedMessageContentSchema
} from "./arbitrator_contents/match_creation_failed_message_content";
import {EmptyMessageContent, EmptyMessageContentSchema} from "./arbitrator_contents/empty_message_content";
import {EchoMessageContent, EchoMessageContentSchema} from "./arbitrator_contents/echo_message_content";
import {AuthMessageContent, AuthMessageContentSchema} from "./arbitrator_contents/auth_message_content";
import {JoinMatchmakingMessageContent, JoinMatchmakingMessageContentSchema} from "./arbitrator_contents/join_matchmaking_message_content";
import {MoveMessageContent, MoveMessageContentSchema} from "./arbitrator_contents/move_message_content";
import {
    UpgradeAuthRequestMessageContent,
    UpgradeAuthRequestMessageContentSchema
} from "./arbitrator_contents/upgrade_auth_request_message_content";
import {
    RequestChallengeMessageContent,
    RequestChallengeMessageContentSchema
} from "./arbitrator_contents/challenge_request_message_content";
import {
    AcceptChallengeMessageContent,
    AcceptChallengeMessageContentSchema
} from "./arbitrator_contents/challenge_request_accepted_message_content";
import {
    DeclineChallengeMessageContent,
    DeclineChallengeMessageContentSchema
} from "./arbitrator_contents/challenge_request_denied_message_content";
import {
    RevokeChallengeMessageContent,
    RevokeChallengeMessageContentSchema
} from "./arbitrator_contents/challenge_request_revoked_message_content";
import z from "zod";
import {
    SubscribeRequestMessageContent,
    SubscribeRequestMessageContentSchema
} from "./arbitrator_contents/subscribe_request_message_content";
import {
    ResignMatchMessageContent,
    ResignMatchMessageContentSchema
} from "./arbitrator_contents/resign_match_message_content";
import {
    LeaveMatchmakingMessageContent,
    LeaveMatchmakingMessageContentSchema
} from "./arbitrator_contents/leave_matchmaking_message_content";

export class ArbitratorMessage<T extends MessageContentType> {
    topic: string;
    contentType: T;
    content: ContentByContentType[T];
    senderKey: string;
    privateKey: string;

    constructor(args: ArbitratorMessage<T>) {
        this.topic = args.topic;
        this.contentType = args.contentType;
        this.content = args.content;
        this.senderKey = args.senderKey;
        this.privateKey = args.privateKey;
    }

    static withContent<T extends MessageContentType>(contentType: T, content: ContentByContentType[T]): ArbitratorMessage<T> {
        return new ArbitratorMessage<T>({
            topic: "",
            senderKey: "",
            privateKey: "",
            contentType,
            content,
        });
    }

    static fromJson<T extends MessageContentType>(jsonObj: { content: T }): ArbitratorMessage<T> {
        const parsedObj = ArbitratorMessageSchema.parse(jsonObj);
        if (!(isMessageContentType(parsedObj.contentType))) {
            throw new TypeError(`Invalid content type ${parsedObj.contentType}`);
        }
        const contentType = parsedObj.contentType as T;
        const contentZod = ContentZodByContentType[contentType];
        const content = contentZod.parse(jsonObj.content) as ContentByContentType[T];
        return new ArbitratorMessage({...parsedObj, contentType, content});
    }
}

export const ArbitratorMessageSchema = z.object({
    topic: z.string(),
    contentType: z.string(),
    content: z.object({}),
    senderKey: z.string(),
    privateKey: z.string(),
});

const ContentZodByContentType: { [K in keyof typeof MessageContentType]: z.ZodObject<any> } = {
    [MessageContentType.MATCH_UPDATED]: MatchUpdateMessageContentSchema,
    [MessageContentType.CHALLENGE_UPDATED]: ChallengeUpdatedMessageContentSchema,
    [MessageContentType.MOVE_FAILED]: MoveFailedMessageContentSchema,
    [MessageContentType.SUBSCRIBE_REQUEST_GRANTED]: SubscribeRequestGrantedMessageContentSchema,
    [MessageContentType.SUBSCRIBE_REQUEST_DENIED]: SubscribeRequestDeniedMessageContentSchema,
    [MessageContentType.UPGRADE_AUTH_GRANTED]: UpgradeAuthGrantedMessageContentSchema,
    [MessageContentType.UPGRADE_AUTH_DENIED]: UpgradeAuthDeniedMessageContentSchema,
    [MessageContentType.CHALLENGE_REQUEST_FAILED]: ChallengeRequestFailedMessageContentSchema,
    [MessageContentType.MATCH_CREATION_FAILED]: MatchCreationFailedMessageContentSchema,
    [MessageContentType.EMPTY]: EmptyMessageContentSchema,
    [MessageContentType.ECHO]: EchoMessageContentSchema,
    [MessageContentType.AUTH]: AuthMessageContentSchema,
    [MessageContentType.JOIN_MATCHMAKING]: JoinMatchmakingMessageContentSchema,
    [MessageContentType.LEAVE_MATCHMAKING]: LeaveMatchmakingMessageContentSchema,
    [MessageContentType.MOVE]: MoveMessageContentSchema,
    [MessageContentType.RESIGN_MATCH]: ResignMatchMessageContentSchema,
    [MessageContentType.SUBSCRIBE_REQUEST]: SubscribeRequestMessageContentSchema,
    [MessageContentType.UPGRADE_AUTH_REQUEST]: UpgradeAuthRequestMessageContentSchema,
    [MessageContentType.CHALLENGE_REQUEST]: RequestChallengeMessageContentSchema,
    [MessageContentType.ACCEPT_CHALLENGE]: AcceptChallengeMessageContentSchema,
    [MessageContentType.DECLINE_CHALLENGE]: DeclineChallengeMessageContentSchema,
    [MessageContentType.REVOKE_CHALLENGE]: RevokeChallengeMessageContentSchema,
};

type ContentByContentType = {
    "MATCH_UPDATED": MatchUpdateMessageContent,
    "CHALLENGE_UPDATED": ChallengeUpdatedMessageContent,
    "MOVE_FAILED": MoveFailedMessageContent,
    "SUBSCRIBE_REQUEST_GRANTED": SubscribeRequestGrantedMessageContent,
    "SUBSCRIBE_REQUEST_DENIED": SubscribeRequestDeniedMessageContent,
    "UPGRADE_AUTH_GRANTED": UpgradeAuthGrantedMessageContent,
    "UPGRADE_AUTH_DENIED": UpgradeAuthDeniedMessageContent,
    "CHALLENGE_REQUEST_FAILED": ChallengeRequestFailedMessageContent,
    "MATCH_CREATION_FAILED": MatchCreationFailedMessageContent,
    "EMPTY": EmptyMessageContent,
    "ECHO": EchoMessageContent,
    "AUTH": AuthMessageContent,
    "JOIN_MATCHMAKING": JoinMatchmakingMessageContent,
    "LEAVE_MATCHMAKING": LeaveMatchmakingMessageContent,
    "MOVE": MoveMessageContent,
    "RESIGN_MATCH": ResignMatchMessageContent,
    "SUBSCRIBE_REQUEST": SubscribeRequestMessageContent,
    "UPGRADE_AUTH_REQUEST": UpgradeAuthRequestMessageContent,
    "CHALLENGE_REQUEST": RequestChallengeMessageContent,
    "ACCEPT_CHALLENGE": AcceptChallengeMessageContent,
    "DECLINE_CHALLENGE": DeclineChallengeMessageContent,
    "REVOKE_CHALLENGE": RevokeChallengeMessageContent,
}

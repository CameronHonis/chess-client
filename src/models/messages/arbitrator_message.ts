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
import {UpgradeAuthRequestMessageContent} from "./arbitrator_contents/upgrade_auth_request_message_content";
import {RequestChallengeMessageContent} from "./arbitrator_contents/challenge_request_message_content";
import {AcceptChallengeMessageContent} from "./arbitrator_contents/challenge_request_accepted_message_content";
import {DeclineChallengeMessageContent} from "./arbitrator_contents/challenge_request_denied_message_content";
import {RevokeChallengeMessageContent} from "./arbitrator_contents/challenge_request_revoked_message_content";
import z from "zod";
import {SubscribeRequestMessageContent} from "./arbitrator_contents/subscribe_request_message_content";

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

export type ArbitratorMessageSchema = z.infer<typeof ArbitratorMessageSchema>;

const ContentZodByContentType: { [K in keyof typeof MessageContentType]: z.ZodObject<any> } = {
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
    "FIND_MATCH": FindMatchMessageContent,
    "MOVE": MoveMessageContent,
    "SUBSCRIBE_REQUEST": SubscribeRequestMessageContent,
    "UPGRADE_AUTH_REQUEST": UpgradeAuthRequestMessageContent,
    "CHALLENGE_REQUEST": RequestChallengeMessageContent,
    "ACCEPT_CHALLENGE": AcceptChallengeMessageContent,
    "DECLINE_CHALLENGE": DeclineChallengeMessageContent,
    "REVOKE_CHALLENGE": RevokeChallengeMessageContent,
}

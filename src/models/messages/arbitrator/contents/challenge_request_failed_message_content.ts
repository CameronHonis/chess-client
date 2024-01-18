import {Challenge} from "../../../challenge";

export interface ChallengeRequestFailedMessageContent {
    challenge: Challenge;
    reason: string;
}
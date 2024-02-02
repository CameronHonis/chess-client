import z from "zod";
import {ApiChallengeSchema} from "../../challenge";

export const ChallengeUpdatedMessageContentSchema = z.object({
    challenge: ApiChallengeSchema,
});

export type ChallengeUpdatedMessageContent = z.infer<typeof ChallengeUpdatedMessageContentSchema>;
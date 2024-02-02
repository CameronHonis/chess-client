import z from "zod";
import {ApiChallengeSchema} from "../../challenge";

export const ChallengeRequestFailedMessageContentSchema = z.object({
    challenge: ApiChallengeSchema,
    reason: z.string(),
});

export type ChallengeRequestFailedMessageContent = z.infer<typeof ChallengeRequestFailedMessageContentSchema>;
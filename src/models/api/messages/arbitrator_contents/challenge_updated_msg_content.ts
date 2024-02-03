import z from "zod";
import {ApiChallengeSchema} from "../../challenge";

export const ChallengeUpdatedMessageContentSchema = z.object({
    challenge: z.union([ApiChallengeSchema, z.null()]),
});

export type ChallengeUpdatedMessageContent = z.infer<typeof ChallengeUpdatedMessageContentSchema>;
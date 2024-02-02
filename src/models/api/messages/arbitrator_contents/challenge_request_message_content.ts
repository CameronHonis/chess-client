import z from "zod";
import {ApiChallengeSchema} from "../../challenge";

export const RequestChallengeMessageContentSchema = z.object({
    challenge: ApiChallengeSchema,
});

export type RequestChallengeMessageContent = z.infer<typeof RequestChallengeMessageContentSchema>;
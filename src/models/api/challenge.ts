import {ApiTimeControlSchema} from "./time_control";
import z from "zod";

export const ApiChallengeSchema = z.object({
    uuid: z.string().uuid(),
    challengerKey: z.union([z.string().length(64), z.literal("")]),
    challengedKey: z.string().length(64),
    isChallengerWhite: z.boolean(),
    isChallengerBlack: z.boolean(),
    timeControl: ApiTimeControlSchema,
    botName: z.string(),
});

export type ApiChallenge = z.infer<typeof ApiChallengeSchema>;

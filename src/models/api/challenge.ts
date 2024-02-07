import {ApiTimeControlSchema} from "./time_control";
import z from "zod";

export const ApiChallengeSchema = z.object({
    uuid: z.string().uuid(),
    challengerKey: z.string().length(64),
    challengedKey: z.union([z.string().length(64), z.literal("")]),
    isChallengerWhite: z.boolean(),
    isChallengerBlack: z.boolean(),
    timeControl: ApiTimeControlSchema,
    botName: z.string(),
    timeCreated: z.string().transform((val) => new Date(val)),
});

export type ApiChallenge = z.infer<typeof ApiChallengeSchema>;

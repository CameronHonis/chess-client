import {ApiTimeControlSchema} from "./time_control";
import z from "zod";
import {ApiBoardSchema} from "./board";
import {ApiMatchResultSchema} from "./match_result";

export const ApiMatchSchema = z.object({
    uuid: z.string().uuid(),
    board: ApiBoardSchema,
    whiteClientKey: z.string().length(64),
    whiteTimeRemainingSec: z.number(),
    blackClientKey: z.string().length(64),
    blackTimeRemainingSec: z.number(),
    timeControl: ApiTimeControlSchema,
    botName: z.string(),
    result: ApiMatchResultSchema,
});

export type ApiMatch = z.infer<typeof ApiMatchSchema>;
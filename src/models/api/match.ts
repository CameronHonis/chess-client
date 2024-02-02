import {ApiTimeControlSchema} from "./time_control";
import z from "zod";
import {ApiBoardSchema} from "./board";

export const ApiMatchSchema = z.object({
    uuid: z.string().uuid(),
    board: ApiBoardSchema,
    whiteClientId: z.string().length(64),
    whiteTimeRemaining: z.number(),
    blackClientId: z.string().length(64),
    blackTimeRemaining: z.number(),
    timeControl: ApiTimeControlSchema,
});

export type ApiMatch = z.infer<typeof ApiMatchSchema>;
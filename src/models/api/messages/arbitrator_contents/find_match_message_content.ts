import z from "zod";
import {ApiTimeControlSchema} from "../../time_control";

export const FindMatchMessageContentSchema = z.object({
    timeControl: ApiTimeControlSchema,
});

export type FindMatchMessageContent = z.infer<typeof FindMatchMessageContentSchema>;
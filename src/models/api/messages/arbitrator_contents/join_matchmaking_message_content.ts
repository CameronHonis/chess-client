import z from "zod";
import {ApiTimeControlSchema} from "../../time_control";

export const JoinMatchmakingMessageContentSchema = z.object({
    timeControl: ApiTimeControlSchema,
});

export type JoinMatchmakingMessageContent = z.infer<typeof JoinMatchmakingMessageContentSchema>;
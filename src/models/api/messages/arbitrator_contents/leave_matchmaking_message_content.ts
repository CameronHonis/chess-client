import {z} from "zod";
export const LeaveMatchmakingMessageContentSchema = z.object({});

export type LeaveMatchmakingMessageContent = z.infer<typeof LeaveMatchmakingMessageContentSchema>;
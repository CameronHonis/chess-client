import z from "zod";

export const EmptyMessageContentSchema = z.object({});

export type EmptyMessageContent = z.infer<typeof EmptyMessageContentSchema>;
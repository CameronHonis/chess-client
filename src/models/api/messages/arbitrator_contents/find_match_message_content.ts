import z from "zod";

export const FindMatchMessageContentSchema = z.object({});

export type FindMatchMessageContent = z.infer<typeof FindMatchMessageContentSchema>;
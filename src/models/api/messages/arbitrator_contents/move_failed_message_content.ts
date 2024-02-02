import z from "zod";

export const MoveFailedMessageContentSchema = z.object({
    reason: z.string(),
});

export type MoveFailedMessageContent = z.infer<typeof MoveFailedMessageContentSchema>;
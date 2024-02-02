import z from "zod";

export const SubscribeRequestDeniedMessageContentSchema = z.object({
    topic: z.string(),
    reason: z.string(),
});

export type SubscribeRequestDeniedMessageContent = z.infer<typeof SubscribeRequestDeniedMessageContentSchema>;
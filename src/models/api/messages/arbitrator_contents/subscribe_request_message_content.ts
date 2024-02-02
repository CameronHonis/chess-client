import z from "zod";

export const SubscribeRequestMessageContentSchema = z.object({
    topic: z.string(),
});

export type SubscribeRequestMessageContent = z.infer<typeof SubscribeRequestMessageContentSchema>;
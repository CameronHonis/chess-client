import z from "zod";

export const SubscribeRequestGrantedMessageContentSchema = z.object({
    topic: z.string(),
});

export type SubscribeRequestGrantedMessageContent = z.infer<typeof SubscribeRequestGrantedMessageContentSchema>;
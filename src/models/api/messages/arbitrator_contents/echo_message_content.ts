import z from "zod";

export const EchoMessageContentSchema = z.object({
    message: z.string(),
});

export type EchoMessageContent = z.infer<typeof EchoMessageContentSchema>;

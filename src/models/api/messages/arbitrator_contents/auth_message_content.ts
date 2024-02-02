import z from "zod";

export const AuthMessageContentSchema = z.object({
    publicKey: z.string().length(64),
    privateKey: z.string(),
});

export type AuthMessageContent = z.infer<typeof AuthMessageContentSchema>;
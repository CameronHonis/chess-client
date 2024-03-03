import z from "zod";

export const RefreshAuthMessageContentSchema = z.object({
    existingAuth: z.optional(z.object({
        publicKey: z.string().length(64),
        privateKey: z.string(),
    })),
});

export type RefreshAuthMessageContent = z.infer<typeof RefreshAuthMessageContentSchema>;
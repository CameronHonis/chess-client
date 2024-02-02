import z from "zod";

export const UpgradeAuthRequestMessageContentSchema = z.object({
    role: z.string(),
    secret: z.string(),
});

export type UpgradeAuthRequestMessageContent = z.infer<typeof UpgradeAuthRequestMessageContentSchema>;
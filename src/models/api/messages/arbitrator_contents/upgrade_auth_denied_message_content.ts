import z from "zod";

export const UpgradeAuthDeniedMessageContentSchema = z.object({
    reason: z.string(),
});

export type UpgradeAuthDeniedMessageContent = z.infer<typeof UpgradeAuthDeniedMessageContentSchema>;
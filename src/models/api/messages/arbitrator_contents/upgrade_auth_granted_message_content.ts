import z from "zod";

export const UpgradeAuthGrantedMessageContentSchema = z.object({
    upgradedToRole: z.string(),
});

export type UpgradeAuthGrantedMessageContent = z.infer<typeof UpgradeAuthGrantedMessageContentSchema>;
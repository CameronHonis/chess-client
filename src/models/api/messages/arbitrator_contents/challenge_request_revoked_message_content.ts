import z from "zod";

export const RevokeChallengeMessageContentSchema = z.object({
    challengerClientKey: z.string().length(64),
});

export type RevokeChallengeMessageContent = z.infer<typeof RevokeChallengeMessageContentSchema>;
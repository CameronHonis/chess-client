import z from "zod";

export const DeclineChallengeMessageContentSchema = z.object({
    challengerClientKey: z.string().length(64),
});

export type DeclineChallengeMessageContent = z.infer<typeof DeclineChallengeMessageContentSchema>;
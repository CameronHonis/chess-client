import z from "zod";

export const AcceptChallengeMessageContentSchema = z.object({
    challengerClientKey: z.string().length(64),
});

export type AcceptChallengeMessageContent = z.infer<typeof AcceptChallengeMessageContentSchema>;
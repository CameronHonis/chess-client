import z from "zod";

export const MatchCreationFailedMessageContentSchema = z.object({
    whiteClientKey: z.string().length(64),
    blackClientKey: z.string().length(64),
    reason: z.string(),
});

export type MatchCreationFailedMessageContent = z.infer<typeof MatchCreationFailedMessageContentSchema>;
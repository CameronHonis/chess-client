import { z } from 'zod';
export const ResignMatchMessageContentSchema = z.object({
    matchId: z.string().uuid(),
});

export type ResignMatchMessageContent = z.infer<typeof ResignMatchMessageContentSchema>;
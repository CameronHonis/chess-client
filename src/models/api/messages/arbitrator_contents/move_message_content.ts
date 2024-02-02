import z from "zod";
import {ApiMoveSchema} from "../../move";

export const MoveMessageContentSchema = z.object({
    matchId: z.string(),
    move: ApiMoveSchema,
});

export type MoveMessageContent = z.infer<typeof MoveMessageContentSchema>;
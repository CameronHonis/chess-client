import z from "zod";
import {ApiMove} from "../../api/move";

export const MoveMessageContent = z.object({
    matchId: z.string(),
    move: ApiMove,
});

export type MoveMessageContent = z.infer<typeof MoveMessageContent>;
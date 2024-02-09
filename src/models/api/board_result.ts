import {z} from 'zod';

export const ApiBoardResultSchema = z.union([
    z.literal("in_progress"),
    z.literal("white_wins_by_checkmate"),
    z.literal("black_wins_by_checkmate"),
    z.literal("draw_by_stalemate"),
    z.literal("draw_by_insufficient_material"),
    z.literal("draw_by_threefold_repetition"),
    z.literal("draw_by_fifty_move_rule"),
]);
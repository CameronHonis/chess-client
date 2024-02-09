import z from "zod";
import {ApiSquareSchema} from "./square";
import {ApiBoardResultSchema} from "./board_result";


export const ApiBoardSchema = z.object({
    pieces: z.array(
        z.array(
            z.number().int()
        ).length(8)
    ).length(8),
    enPassantSquare: z.union([z.null(), ApiSquareSchema]),
    isWhiteTurn: z.boolean(),
    canWhiteCastleKingside: z.boolean(),
    canWhiteCastleQueenside: z.boolean(),
    canBlackCastleKingside: z.boolean(),
    canBlackCastleQueenside: z.boolean(),
    halfMoveClockCount: z.number().int(),
    fullMoveCount: z.number().int(),
    repetitionsByMiniFEN: z.record(z.number().int().positive()),
    result: ApiBoardResultSchema,
});

export type ApiBoard = z.infer<typeof ApiBoardSchema>;
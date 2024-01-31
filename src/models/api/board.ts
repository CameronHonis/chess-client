import z from "zod";
import {ApiSquare} from "./square";


export const ApiBoard = z.object({
    pieces: z.array(
        z.array(
            z.number().int()
        ).length(8)
    ).length(8),
    enPassantSquare: z.union([z.null(), ApiSquare]),
    isWhiteTurn: z.boolean(),
    canWhiteCastleKingside: z.boolean(),
    canWhiteCastleQueenside: z.boolean(),
    canBlackCastleKingside: z.boolean(),
    canBlackCastleQueenside: z.boolean(),
    halfMoveClockCount: z.number().int(),
    fullMoveCount: z.number().int(),
    repetitionsByMiniFEN: z.map(z.string(), z.number().int()),
    isTerminal: z.boolean(),
    isWhiteWinner: z.boolean(),
    isBlackWinner: z.boolean(),
});

export type ApiBoard = z.infer<typeof ApiBoard>;
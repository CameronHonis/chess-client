import z from "zod";
import {ApiSquareSchema} from "./square";
import {ApiPieceSchema} from "./piece";

export const ApiMoveSchema = z.object({
    piece: ApiPieceSchema,
    startSquare: ApiSquareSchema,
    endSquare: ApiSquareSchema,
    capturedPiece: z.number().int(),
    kingCheckingSquares: z.array(ApiSquareSchema),
    pawnUpgradedTo: z.number().int(),
});

export type ApiMove = z.infer<typeof ApiMoveSchema>;
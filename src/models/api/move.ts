import z from "zod";
import {ApiSquare} from "./square";
import {ApiPiece} from "./piece";

export const ApiMove = z.object({
    piece: ApiPiece,
    startSquare: ApiSquare,
    endSquare: ApiSquare,
    capturedPiece: z.number().int(),
    kingCheckingSquares: z.array(ApiSquare),
    pawnUpgradedTo: z.number().int(),
});

export type ApiMove = z.infer<typeof ApiMove>;
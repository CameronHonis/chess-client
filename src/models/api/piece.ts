import z from "zod";

export const ApiPiece = z.number().int().gte(0);

export type ApiPiece = z.infer<typeof ApiPiece>;
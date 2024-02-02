import z from "zod";

export const ApiPieceSchema = z.number().int().gte(0);
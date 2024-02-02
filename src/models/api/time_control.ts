import z from "zod";

export const ApiTimeControlSchema = z.object({
    initialTimeSec: z.number().positive(),
    incrementSec: z.number().gte(0),
    timeAfterMovesCount: z.number().gte(0),
    secAfterMoves: z.number().gte(0).int(),
});

export type ApiTimeControl = z.infer<typeof ApiTimeControlSchema>;
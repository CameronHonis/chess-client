import z from "zod";

export const ApiSquareSchema = z.object({
    rank: z.number(),
    file: z.number(),
});

export type ApiSquare = z.infer<typeof ApiSquareSchema>;
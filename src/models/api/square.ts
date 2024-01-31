import z from "zod";

export const ApiSquare = z.object({
    rank: z.number(),
    file: z.number(),
});

export type ApiSquare = z.infer<typeof ApiSquare>;
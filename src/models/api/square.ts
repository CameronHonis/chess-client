import z from "zod";

export const ApiSquare = z.object({
    rank: z.string(),
    file: z.string(),
});

export type ApiSquare = z.infer<typeof ApiSquare>;
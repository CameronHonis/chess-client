import z from "zod";
import {ApiMatchSchema} from "../../match";

export const MatchUpdateMessageContentSchema = z.object({
    match: z.union([ApiMatchSchema, z.null()]),
});

export type MatchUpdateMessageContent = z.infer<typeof MatchUpdateMessageContentSchema>;
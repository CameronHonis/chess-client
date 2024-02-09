import z from "zod";
import {ApiMatchSchema} from "../../match";

export const MatchUpdateMessageContentSchema = z.object({
    match: ApiMatchSchema,
});

export type MatchUpdateMessageContent = z.infer<typeof MatchUpdateMessageContentSchema>;
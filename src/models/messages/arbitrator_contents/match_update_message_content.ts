import z from "zod";
import {ApiMatch} from "../../api/match";

export const MatchUpdateMessageContent = z.object({
    match: ApiMatch,
});

export type MatchUpdateMessageContent = z.infer<typeof MatchUpdateMessageContent>;

// export class MatchUpdateMessageContent extends Templated {
//     match: Match;
//
//     constructor(args: MatchUpdateMessageContent) {
//         super({});
//         this.match = new Match(args.match);
//     }
//
//     static template(): Object {
//         return {
//             match: Match.template(),
//         };
//     }
// }

import {ApiChallenge} from "../../api/challenge";
import z from "zod";

export const ChallengeRequestFailedMessageContent = z.object({
    challenge: ApiChallenge,
    reason: z.string(),
});

// export class ChallengeRequestFailedMessageContent extends Templated {
//     challenge: Challenge;
//     reason: string;
//
//     constructor(args: ChallengeRequestFailedMessageContent) {
//         super({});
//         this.challenge = args.challenge;
//         this.reason = args.reason;
//     }
//
//     static template(): Object {
//         return {
//             challenge: Challenge.template(),
//             reason: "git gud before challenging me scrub",
//         };
//     }
// }
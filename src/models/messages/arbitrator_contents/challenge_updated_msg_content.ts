import {ApiChallenge} from "../../api/challenge";
import z from "zod";

export const ChallengeUpdatedMessageContent = z.object({
    challenge: ApiChallenge,
});

export type ChallengeUpdatedMessageContent = z.infer<typeof ChallengeUpdatedMessageContent>;

// export class ChallengeUpdatedMessageContent extends Templated {
//     challenge: Challenge;
//
//     constructor(args: ChallengeUpdatedMessageContent) {
//         super({});
//         this.challenge = args.challenge;
//     }
//
//     static template(): Object {
//         return {
//             challenge: Challenge.template(),
//         };
//     }
// }
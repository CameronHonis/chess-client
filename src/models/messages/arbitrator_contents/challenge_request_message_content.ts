import {ApiChallenge} from "../../api/challenge";
import z from "zod";

export const RequestChallengeMessageContent = z.object({
    challenge: ApiChallenge,
});

export type RequestChallengeMessageContent = z.infer<typeof RequestChallengeMessageContent>;
//
// export class RequestChallengeMessageContent extends Templated {
//     challenge: Challenge;
//
//     constructor(args: RequestChallengeMessageContent) {
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
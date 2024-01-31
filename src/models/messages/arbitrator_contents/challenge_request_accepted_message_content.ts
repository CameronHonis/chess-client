import z from "zod";

export const AcceptChallengeMessageContent = z.object({
    challengerClientKey: z.string().length(64),
});

export type AcceptChallengeMessageContent = z.infer<typeof AcceptChallengeMessageContent>;

// export class AcceptChallengeMessageContent extends Templated {
//     challengerClientKey: string;
//
//     constructor(args: AcceptChallengeMessageContent) {
//         super({});
//         this.challengerClientKey = args.challengerClientKey;
//     }
//
//     static template(): Object {
//         return {
//             challengerClientKey: "some-challenger-key"
//         }
//     }
// }
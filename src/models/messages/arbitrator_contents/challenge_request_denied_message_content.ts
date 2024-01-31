import z from "zod";

export const DeclineChallengeMessageContent = z.object({
    challengerClientKey: z.string().length(64),
});

export type DeclineChallengeMessageContent = z.infer<typeof DeclineChallengeMessageContent>;

// export class DeclineChallengeMessageContent extends Templated {
//     challengerClientKey: string;
//
//     constructor(args: DeclineChallengeMessageContent) {
//         super({});
//         this.challengerClientKey = args.challengerClientKey;
//     }
//
//     static template(): Object {
//         return {
//             challengerClientKey: "some-challenger-key",
//         };
//     }
// }
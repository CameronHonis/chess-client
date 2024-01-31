import z from "zod";

export const RevokeChallengeMessageContent = z.object({
    challengerClientKey: z.string().length(64),
});

export type RevokeChallengeMessageContent = z.infer<typeof RevokeChallengeMessageContent>;

// export class RevokeChallengeMessageContent extends Templated {
//     challengerClientKey: string;
//
//     constructor(args: RevokeChallengeMessageContent) {
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
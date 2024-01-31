import z from "zod";

export const UpgradeAuthDeniedMessageContent = z.object({
    reason: z.string(),
});

export type UpgradeAuthDeniedMessageContent = z.infer<typeof UpgradeAuthDeniedMessageContent>;

// export class UpgradeAuthDeniedMessageContent extends Templated {
//     reason: string;
//
//     constructor(args: UpgradeAuthDeniedMessageContent) {
//         super({});
//         this.reason = args.reason;
//     }
//
//     static template(): Object {
//         return {
//             reason: "nice try, hacker mans",
//         };
//     }
// }

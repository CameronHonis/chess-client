import z from "zod";

export const UpgradeAuthGrantedMessageContent = z.object({
    upgradedToRole: z.string(),
});

export type UpgradeAuthGrantedMessageContent = z.infer<typeof UpgradeAuthGrantedMessageContent>;

// export class UpgradeAuthGrantedMessageContent extends Templated {
//     upgradedToRole: string;
//
//     constructor(args: UpgradeAuthGrantedMessageContent) {
//         super({});
//         this.upgradedToRole = args.upgradedToRole;
//     }
//
//     static template(): Object {
//         return {
//             upgradedToRole: "new-role"
//         };
//     }
// }

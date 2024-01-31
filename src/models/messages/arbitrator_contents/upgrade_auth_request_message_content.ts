import z from "zod";

export const UpgradeAuthRequestMessageContent = z.object({
    role: z.string(),
    secret: z.string(),
});

export type UpgradeAuthRequestMessageContent = z.infer<typeof UpgradeAuthRequestMessageContent>;

// export class UpgradeAuthRequestMessageContent extends Templated {
//     role: string;
//     secret: string;
//
//     constructor(args: UpgradeAuthRequestMessageContent) {
//         super({});
//         this.role = args.role;
//         this.secret = args.secret;
//     }
//
//     static template(): Object {
//         return {
//             role: "desired-role",
//             secret: "p4ssw0rd123",
//         }
//     }
// }

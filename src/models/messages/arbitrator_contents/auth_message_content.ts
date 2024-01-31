import z from "zod";

export const AuthMessageContent = z.object({
    publicKey: z.string().length(64),
    privateKey: z.string(),
});

export type AuthMessageContent = z.infer<typeof AuthMessageContent>;

// export class AuthMessageContent extends Templated {
//     publicKey: string;
//     privateKey: string;
//
//     constructor(args: AuthMessageContent) {
//         super({});
//         this.publicKey = args.publicKey;
//         this.privateKey = args.privateKey;
//     }
//
//     static template(): Object {
//         return {
//             publicKey: "some-public-key",
//             privateKey: "some-private-key",
//         };
//     }
// }

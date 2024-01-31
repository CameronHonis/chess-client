import z from "zod";

export const EchoMessageContent = z.object({
    message: z.string(),
});

export type EchoMessageContent = z.infer<typeof EchoMessageContent>;

// export class EchoMessageContent extends Templated {
//     message: string;
//
//     constructor(args: EchoMessageContent) {
//         super({});
//         this.message = args.message;
//     }
//
//     static template(): Object {
//         return {
//             message: "ECHO ECHo ECho Echo echo",
//         };
//     }
// }

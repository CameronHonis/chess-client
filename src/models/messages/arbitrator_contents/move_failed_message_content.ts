import z from "zod";

export const MoveFailedMessageContent = z.object({
    reason: z.string(),
});

export type MoveFailedMessageContent = z.infer<typeof MoveFailedMessageContent>;

// export class MoveFailedMessageContent extends Templated {
//     // reason: string;
//     //
//     // constructor(args: MoveFailedMessageContent) {
//     //     super({});
//     //     this.reason = args.reason;
//     // }
//     //
//     // static template(): Object {
//     //     return {
//     //         reason: "move failed bucko",
//     //     };
//     // }
// }
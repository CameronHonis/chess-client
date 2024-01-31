import z from "zod";

export const EmptyMessageContent = z.object({});

export type EmptyMessageContent = z.infer<typeof EmptyMessageContent>;

// export class EmptyMessageContent extends Templated {
//
//     constructor(args: EmptyMessageContent) {
//         super({});
//     }
//
//     static template(): Object {
//         return {};
//     }
// }

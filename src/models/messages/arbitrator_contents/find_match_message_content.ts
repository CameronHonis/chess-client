import z from "zod";

export const FindMatchMessageContent = z.object({});

export type FindMatchMessageContent = z.infer<typeof FindMatchMessageContent>;

// export class FindMatchMessageContent extends Templated {
//     constructor(args: FindMatchMessageContent) {
//         super({});
//     }
//
//     static template(): Object {
//         return {};
//     }
// }

import z from "zod";

export const SubscribeRequestMessageContent = z.object({
    topic: z.string(),
});

export type SubscribeRequestMessageContent = z.infer<typeof SubscribeRequestMessageContent>;

// export class SubscribeRequestMessageContent extends Templated {
//     topic: string;
//
//     constructor(args: SubscribeRequestMessageContent) {
//         super({});
//         this.topic = args.topic;
//     }
//
//     static template(): Object {
//         return {
//             topic: "some-topic",
//         };
//     }
// }

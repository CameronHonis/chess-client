import z from "zod";

export const SubscribeRequestGrantedMessageContent = z.object({
    topic: z.string(),
});

export type SubscribeRequestGrantedMessageContent = z.infer<typeof SubscribeRequestGrantedMessageContent>;

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

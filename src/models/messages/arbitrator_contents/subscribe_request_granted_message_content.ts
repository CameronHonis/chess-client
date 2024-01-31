import z from "zod";

export const SubscribeRequestGrantedMessageContent = z.object({
    topic: z.string(),
});

export type SubscribeRequestGrantedMessageContent = z.infer<typeof SubscribeRequestGrantedMessageContent>;

// export class SubscribeRequestGrantedMessageContent extends Templated {
//     topic: string;
//
//     constructor(args: SubscribeRequestGrantedMessageContent) {
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

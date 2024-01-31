import z from "zod";

export const SubscribeRequestDeniedMessageContent = z.object({
    topic: z.string(),
    reason: z.string(),
});

export type SubscribeRequestDeniedMessageContent = z.infer<typeof SubscribeRequestDeniedMessageContent>;

// export class SubscribeRequestDeniedMessageContent {
//     topic: string;
//     reason: string;
//
//     constructor(args: SubscribeRequestDeniedMessageContent) {
//         this.topic = args.topic;
//         this.reason = args.reason;
//     }
//
//     static template(): Object {
//         return {
//             topic: "some-topic",
//             reason: "because I said so bucko",
//         };
//     }
// }

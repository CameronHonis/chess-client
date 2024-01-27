export class SubscribeRequestDeniedMessageContent {
    topic: string;
    reason: string;

    constructor(args: SubscribeRequestDeniedMessageContent) {
        this.topic = args.topic;
        this.reason = args.reason;
    }

    static template(): Object {
        return {
            topic: "some-topic",
            reason: "because I said so bucko",
        };
    }
}

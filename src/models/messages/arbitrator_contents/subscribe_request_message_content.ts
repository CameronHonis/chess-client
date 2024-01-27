import {Templated} from "../../../abcs/templated";

export class SubscribeRequestMessageContent extends Templated {
    topic: string;

    constructor(args: SubscribeRequestMessageContent) {
        super({});
        this.topic = args.topic;
    }

    static template(): Object {
        return {
            topic: "some-topic",
        };
    }
}

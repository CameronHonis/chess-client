import {Templated} from "../../../abcs/templated";

export class SubscribeRequestGrantedMessageContent extends Templated {
    topic: string;

    constructor(args: SubscribeRequestGrantedMessageContent) {
        super({});
        this.topic = args.topic;
    }

    static template(): Object {
        return {
            topic: "some-topic",
        };
    }
}

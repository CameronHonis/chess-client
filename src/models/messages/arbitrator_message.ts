import {ArbitratorTopic} from "../enums/message_topic";

export class ArbitratorMessage {
    topic: ArbitratorTopic
    constructor(topic: ArbitratorTopic) {
        this.topic = topic;
    }
}
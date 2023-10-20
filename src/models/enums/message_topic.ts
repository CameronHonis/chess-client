export type MessageTopic = ArbitratorTopic & OtherTopic;

export enum ArbitratorTopic {
    AUTH,
    MATCHMAKING,
    ACTION,
}

export enum OtherTopic {
    SOME_VALUE
}
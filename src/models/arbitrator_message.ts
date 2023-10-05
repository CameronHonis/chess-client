import {Arbitrator_topic} from "./enums/arbitrator_topic";
import {MessageDirection} from "./enums/pub_sub_message_direction";

interface ArbitratorMessageConstructorArgs {
    topic: Arbitrator_topic;
    direction: MessageDirection;
}

export class ArbitratorMessage {
    topic: Arbitrator_topic
    direction: MessageDirection

    constructor({topic, direction}: ArbitratorMessageConstructorArgs) {
        this.topic = topic;
        this.direction = direction;
    }
}

interface RequestActionMessageConstructorArgs {
    direction: MessageDirection;
    boardStateFEN: string;
    whiteTime: number;
    blackTime: number;
}

export class RequestActionMessage extends ArbitratorMessage {
    boardStateFEN: string
    whiteTime: number;
    blackTime: number;

    constructor({direction, boardStateFEN, whiteTime, blackTime}: RequestActionMessageConstructorArgs) {
        super({topic: Arbitrator_topic.ACTION, direction,});
        this.boardStateFEN = boardStateFEN;
        this.whiteTime = whiteTime;
        this.blackTime = blackTime;
    }
}

interface ResponseActionMessageConstructorArgs {
    direction: MessageDirection;
    movetext: string;
}

export class ResponseActionMessage extends ArbitratorMessage {
    movetext: string

    constructor({direction, movetext}: ResponseActionMessageConstructorArgs) {
        super({topic: Arbitrator_topic.ACTION, direction });
        this.movetext = movetext;
    }
}

interface RequestGameMessageConstructorArgs {
    direction: MessageDirection;
}

export class RequestGameMessage extends ArbitratorMessage {
    constructor({direction}: RequestGameMessageConstructorArgs) {
        super({topic: Arbitrator_topic.MATCHMAKING, direction});
    }
}

interface ResponseGameMessageConstructorArgs {
    direction: MessageDirection;
    whiteName: string
    blackName: string
    whiteElo: number
    blackElo: number
}

export class ResponseGameMessage extends ArbitratorMessage {
    whiteName: string;
    blackName: string;
    whiteElo: number;
    blackElo: number;
    constructor({direction, whiteName, blackName, whiteElo, blackElo}: ResponseGameMessageConstructorArgs) {
        super({topic: Arbitrator_topic.MATCHMAKING, direction});
        this.whiteName = whiteName;
        this.blackName = blackName;
        this.whiteElo = whiteElo;
        this.blackElo = blackElo;
    }
}
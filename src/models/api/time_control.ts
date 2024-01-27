import {Templated} from "../../abcs/templated";

export interface TimeControlArgs {
    initialTimeSeconds: number;
    incrementSeconds: number;
    timeAfterMovesCount: number;
    secondsAfterMoves: number;
}

export class TimeControl extends Templated {
    initialTimeSeconds: number;
    incrementSeconds: number;
    timeAfterMovesCount: number;
    secondsAfterMoves: number;

    constructor({initialTimeSeconds, incrementSeconds, timeAfterMovesCount, secondsAfterMoves}: TimeControlArgs) {
        super({});
        this.initialTimeSeconds = initialTimeSeconds;
        this.incrementSeconds = incrementSeconds;
        this.timeAfterMovesCount = timeAfterMovesCount;
        this.secondsAfterMoves = secondsAfterMoves;
    }

    static template(): Object {
        const rapidTimeControl = newRapidTimeControl();
        return JSON.parse(JSON.stringify(rapidTimeControl));
    }
}

export function newBulletTimeControl(): TimeControl {
    return new TimeControl({
        initialTimeSeconds: 60,
        incrementSeconds: 0,
        timeAfterMovesCount: 0,
        secondsAfterMoves: 0,
    });
}

export function newBlitzTimeControl(): TimeControl {
    return new TimeControl({
        initialTimeSeconds: 300,
        incrementSeconds: 0,
        timeAfterMovesCount: 0,
        secondsAfterMoves: 0,
    });
}

export function newRapidTimeControl(): TimeControl {
    return new TimeControl({
        initialTimeSeconds: 900,
        incrementSeconds: 0,
        timeAfterMovesCount: 0,
        secondsAfterMoves: 0,
    });
}
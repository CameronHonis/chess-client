import {Templated} from "../../abcs/templated";

export class TimeControl extends Templated {
    initialTimeSec: number;
    incrementSec: number;
    timeAfterMovesCount: number;
    secAfterMoves: number;

    constructor(args: TimeControl) {
        super({});
        this.initialTimeSec = args.initialTimeSec;
        this.incrementSec = args.incrementSec;
        this.timeAfterMovesCount = args.timeAfterMovesCount;
        this.secAfterMoves = args.secAfterMoves;
    }

    static template(): Object {
        const rapidTimeControl = newRapidTimeControl();
        return JSON.parse(JSON.stringify(rapidTimeControl));
    }
}

export function newBulletTimeControl(): TimeControl {
    return new TimeControl({
        initialTimeSec: 60,
        incrementSec: 0,
        timeAfterMovesCount: 0,
        secAfterMoves: 0,
    });
}

export function newBlitzTimeControl(): TimeControl {
    return new TimeControl({
        initialTimeSec: 300,
        incrementSec: 0,
        timeAfterMovesCount: 0,
        secAfterMoves: 0,
    });
}

export function newRapidTimeControl(): TimeControl {
    return new TimeControl({
        initialTimeSec: 900,
        incrementSec: 0,
        timeAfterMovesCount: 0,
        secAfterMoves: 0,
    });
}
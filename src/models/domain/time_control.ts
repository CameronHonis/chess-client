import {ApiTimeControl, ApiTimeControlSchema} from "../api/time_control";

export interface TimeControlArgs {
    initialTimeSec: number;
    incrementSec: number;
    timeAfterMovesCount: number;
    secAfterMoves: number;
}

export class TimeControl {
    initialTimeSec: number;
    incrementSec: number;
    timeAfterMovesCount: number;
    secAfterMoves: number;

    constructor(args: TimeControlArgs) {
        this.initialTimeSec = args.initialTimeSec;
        this.incrementSec = args.incrementSec;
        this.timeAfterMovesCount = args.timeAfterMovesCount;
        this.secAfterMoves = args.secAfterMoves;
    }

    repr(): string {
        const initTimeMin = Math.floor((this.initialTimeSec + 1e-4) / 60);
        const incrTimeSec = Math.floor(this.incrementSec + 1e-4);
        return `${initTimeMin}+${incrTimeSec}`;
    }

    static fromApi(apiTimeControl: ApiTimeControl): TimeControl {
        return new TimeControl({
            initialTimeSec: apiTimeControl.initialTimeSec,
            incrementSec: apiTimeControl.incrementSec,
            timeAfterMovesCount: apiTimeControl.timeAfterMovesCount,
            secAfterMoves: apiTimeControl.secAfterMoves,
        });
    }
}
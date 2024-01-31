import {ApiTimeControl} from "../api/time_control";

export class TimeControl {
    initialTimeSec: number;
    incrementSec: number;
    timeAfterMovesCount: number;
    secAfterMoves: number;

    constructor(args: TimeControl) {
        this.initialTimeSec = args.initialTimeSec;
        this.incrementSec = args.incrementSec;
        this.timeAfterMovesCount = args.timeAfterMovesCount;
        this.secAfterMoves = args.secAfterMoves;
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
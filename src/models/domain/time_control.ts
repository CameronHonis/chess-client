import {ApiTimeControl} from "../api/time_control";

export interface TimeControlArgs {
    initialTimeSec: number;
    incrementSec: number;
    timeAfterMovesCount: number;
    secAfterMoves: number;
}

export enum TimeControlPreset {
    BULLET = "bullet",
    BLITZ = "blitz",
    RAPID = "rapid",
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

    static fromPreset(timeControlPreset: TimeControlPreset) {
        switch(timeControlPreset){
            case TimeControlPreset.BLITZ:
                return newBlitzTimeControl();
            case TimeControlPreset.RAPID:
                return newRapidTimeControl();
            case TimeControlPreset.BULLET:
                return newBulletTimeControl();
            default:
                throw new Error(`timeControl preset '${timeControlPreset}' not valid`);
        }
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

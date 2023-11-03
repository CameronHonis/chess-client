export interface TimeControlArgs {
    initialTimeSeconds: number;
    incrementSeconds: number;
    timeAfterMovesCount: number;
    secondsAfterMoves: number;
}

export class TimeControl {
    initialTimeSeconds: number;
    incrementSeconds: number;
    timeAfterMovesCount: number;
    secondsAfterMoves: number;

    constructor({initialTimeSeconds, incrementSeconds, timeAfterMovesCount, secondsAfterMoves}: TimeControlArgs) {
        this.initialTimeSeconds = initialTimeSeconds;
        this.incrementSeconds = incrementSeconds;
        this.timeAfterMovesCount = timeAfterMovesCount;
        this.secondsAfterMoves = secondsAfterMoves;
    }
}
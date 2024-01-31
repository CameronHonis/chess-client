import z from "zod";

export const TimeControl = z.object({
    initialTimeSec: z.number().positive(),
    incrementSec: z.number().gte(0),
    timeAfterMovesCount: z.number().gte(0),
    secAfterMoves: z.number().gte(0).int(),
})

export type TimeControl = z.infer<typeof TimeControl>

// export class TimeControl extends Templated {
//     initialTimeSec: number;
//     incrementSec: number;
//     timeAfterMovesCount: number;
//     secAfterMoves: number;
//
//     constructor(args: TimeControl) {
//         super({});
//         this.initialTimeSec = args.initialTimeSec;
//         this.incrementSec = args.incrementSec;
//         this.timeAfterMovesCount = args.timeAfterMovesCount;
//         this.secAfterMoves = args.secAfterMoves;
//     }
//
//     static template(): Object {
//         const rapidTimeControl = newRapidTimeControl();
//         return JSON.parse(JSON.stringify(rapidTimeControl));
//     }
// }

export function newBulletTimeControl(): TimeControl {
    return {
        initialTimeSec: 60,
        incrementSec: 0,
        timeAfterMovesCount: 0,
        secAfterMoves: 0,
    };
}

export function newBlitzTimeControl(): TimeControl {
    return {
        initialTimeSec: 300,
        incrementSec: 0,
        timeAfterMovesCount: 0,
        secAfterMoves: 0,
    };
}

export function newRapidTimeControl(): TimeControl {
    return {
        initialTimeSec: 900,
        incrementSec: 0,
        timeAfterMovesCount: 0,
        secAfterMoves: 0,
    };
}
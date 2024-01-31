import z from "zod";

export const ApiTimeControl = z.object({
    initialTimeSec: z.number().positive(),
    incrementSec: z.number().gte(0),
    timeAfterMovesCount: z.number().gte(0),
    secAfterMoves: z.number().gte(0).int(),
})

export type ApiTimeControl = z.infer<typeof ApiTimeControl>

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

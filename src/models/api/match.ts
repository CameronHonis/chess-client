import {TimeControl} from "./time_control";
import z from "zod";
import {ApiBoard} from "./board";

export const ApiMatch = z.object({
    uuid: z.string().uuid(),
    board: ApiBoard,
    whiteClientId: z.string().length(64),
    whiteTimeRemaining: z.number(),
    blackClientId: z.string().length(64),
    blackTimeRemaining: z.number(),
    timeControl: TimeControl,
});

export type ApiMatch = z.infer<typeof ApiMatch>;

// export class Match extends Templated {
//     uuid: string;
//     board: BoardState;
//     whiteClientId: string;
//     whiteTimeRemaining: number;
//     blackClientId: string;
//     blackTimeRemaining: number;
//     timeControl: TimeControl;
//
//     constructor({
//                     uuid,
//                     board,
//                     whiteClientId,
//                     whiteTimeRemaining,
//                     blackClientId,
//                     blackTimeRemaining,
//                     timeControl
//                 }: Match) {
//         super({});
//         this.uuid = uuid;
//         this.board = new BoardState(board);
//         this.whiteClientId = whiteClientId;
//         this.whiteTimeRemaining = whiteTimeRemaining;
//         this.blackClientId = blackClientId;
//         this.blackTimeRemaining = blackTimeRemaining;
//         this.timeControl = timeControl;
//     }
//
//     static template(): Object {
//         return {
//             uuid: "some-uuid",
//             board: BoardState.template(),
//             whiteClientId: "some-client1-key",
//             whiteTimeRemaining: 100.0,
//             blackClientId: "some-client2-key",
//             blackTimeRemaining: 80.5,
//             timeControl: {
//
//             },
//         };
//     }
// }
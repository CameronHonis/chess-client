import {BoardState} from "./board_state";
import {TimeControl} from "./time_control";

export interface MatchArgs {
    uuid: string;
    board: BoardState;
    whiteClientId: string;
    whiteTimeRemaining: number;
    blackClientId: string;
    blackTimeRemaining: number;
    timeControl: TimeControl;
}

export class Match {
    uuid: string;
    board: BoardState;
    whiteClientId: string;
    whiteTimeRemaining: number;
    blackClientId: string;
    blackTimeRemaining: number;
    timeControl: TimeControl;

    constructor({
                    uuid,
                    board,
                    whiteClientId,
                    whiteTimeRemaining,
                    blackClientId,
                    blackTimeRemaining,
                    timeControl
                }: MatchArgs) {
        this.uuid = uuid;
        this.board = board;
        this.whiteClientId = whiteClientId;
        this.whiteTimeRemaining = whiteTimeRemaining;
        this.blackClientId = blackClientId;
        this.blackTimeRemaining = blackTimeRemaining;
        this.timeControl = timeControl;
    }
}
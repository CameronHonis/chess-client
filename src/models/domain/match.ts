import {BoardState} from "./board_state";
import {TimeControl} from "./time_control";
import {ApiMatch} from "../api/match";

export class Match {
    uuid: string;
    board: BoardState;
    whiteTimeRemaining: number;
    whiteClientId: string;
    blackTimeRemaining: number;
    blackClientId: string;
    timeControl: TimeControl;

    constructor(args: Match) {
        this.uuid = args.uuid;
        this.board = args.board;
        this.whiteTimeRemaining = args.whiteTimeRemaining;
        this.whiteClientId = args.whiteClientId;
        this.blackTimeRemaining = args.blackTimeRemaining;
        this.blackClientId = args.blackClientId;
        this.timeControl = args.timeControl;
    }

    static fromApi(apiMatch: ApiMatch): Match {
        return new Match({
            uuid: apiMatch.uuid,
            board: BoardState.fromApi(apiMatch.board),
            whiteTimeRemaining: apiMatch.whiteTimeRemaining,
            whiteClientId: apiMatch.whiteClientId,
            blackTimeRemaining: apiMatch.blackTimeRemaining,
            blackClientId: apiMatch.blackClientId,
            timeControl: TimeControl.fromApi(apiMatch.timeControl),
        });
    }
}
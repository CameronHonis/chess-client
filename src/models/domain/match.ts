import {BoardState} from "./board_state";
import {TimeControl} from "./time_control";
import {ApiMatch} from "../api/match";

export class Match {
    uuid: string;
    board: BoardState;
    whiteTimeRemainingSec: number;
    whiteClientKey: string;
    blackTimeRemainingSec: number;
    blackClientKey: string;
    timeControl: TimeControl;

    constructor(args: Match) {
        this.uuid = args.uuid;
        this.board = args.board;
        this.whiteTimeRemainingSec = args.whiteTimeRemainingSec;
        this.whiteClientKey = args.whiteClientKey;
        this.blackTimeRemainingSec = args.blackTimeRemainingSec;
        this.blackClientKey = args.blackClientKey;
        this.timeControl = args.timeControl;
    }

    static fromApi(apiMatch: ApiMatch): Match {
        return new Match({
            uuid: apiMatch.uuid,
            board: BoardState.fromApi(apiMatch.board),
            whiteTimeRemainingSec: apiMatch.whiteTimeRemainingSec,
            whiteClientKey: apiMatch.whiteClientKey,
            blackTimeRemainingSec: apiMatch.blackTimeRemainingSec,
            blackClientKey: apiMatch.blackClientKey,
            timeControl: TimeControl.fromApi(apiMatch.timeControl),
        });
    }
}
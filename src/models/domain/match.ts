import {BoardState} from "./board_state";
import {TimeControl} from "./time_control";
import {ApiMatch} from "../api/match";
import {BotType, isBotType} from "./bot_type";
import {Throwable} from "../../types";

export class Match {
    uuid: string;
    board: BoardState;
    whiteTimeRemainingSec: number;
    whiteClientKey: string;
    blackTimeRemainingSec: number;
    blackClientKey: string;
    timeControl: TimeControl;
    botName: "" | BotType;

    constructor(args: Match) {
        this.uuid = args.uuid;
        this.board = args.board;
        this.whiteTimeRemainingSec = args.whiteTimeRemainingSec;
        this.whiteClientKey = args.whiteClientKey;
        this.blackTimeRemainingSec = args.blackTimeRemainingSec;
        this.blackClientKey = args.blackClientKey;
        this.timeControl = args.timeControl;
        this.botName = args.botName;
    }

    static fromApi(apiMatch: ApiMatch): Throwable<Match> {
        const match = new Match({
            uuid: apiMatch.uuid,
            board: BoardState.fromApi(apiMatch.board),
            whiteTimeRemainingSec: apiMatch.whiteTimeRemainingSec,
            whiteClientKey: apiMatch.whiteClientKey,
            blackTimeRemainingSec: apiMatch.blackTimeRemainingSec,
            blackClientKey: apiMatch.blackClientKey,
            timeControl: TimeControl.fromApi(apiMatch.timeControl),
            botName: "",
        });
        if (apiMatch.botName !== "") {
            if (!isBotType(apiMatch.botName)) {
                throw new Error(`invalid bot name: ${apiMatch.botName}`);
            } else {
                match.botName = apiMatch.botName;
            }
        }
        return match;
    }
}
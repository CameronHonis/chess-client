import {Board} from "./board";
import {TimeControl} from "./time_control";
import {ApiMatch} from "../api/match";
import {BotType, isBotType} from "./bot_type";
import {Throwable} from "../../types";
import {MatchResult, matchResultFromApi} from "./match_result";
import {Move} from "./move";

export class Match {
    uuid: string;
    board: Board;
    lastMove: Move | null;
    whiteTimeRemainingSec: number;
    whiteClientKey: string;
    blackTimeRemainingSec: number;
    blackClientKey: string;
    timeControl: TimeControl;
    botName: "" | BotType;
    result: MatchResult;

    constructor(args: Match) {
        this.uuid = args.uuid;
        this.board = args.board;
        this.lastMove = args.lastMove;
        this.whiteTimeRemainingSec = args.whiteTimeRemainingSec;
        this.whiteClientKey = args.whiteClientKey;
        this.blackTimeRemainingSec = args.blackTimeRemainingSec;
        this.blackClientKey = args.blackClientKey;
        this.timeControl = args.timeControl;
        this.botName = args.botName;
        this.result = args.result;
    }

    static fromApi(apiMatch: ApiMatch): Throwable<Match> {
        const match = new Match({
            uuid: apiMatch.uuid,
            board: Board.fromApi(apiMatch.board),
            lastMove: apiMatch.lastMove === null ? null : Move.fromApi(apiMatch.lastMove),
            whiteTimeRemainingSec: apiMatch.whiteTimeRemainingSec,
            whiteClientKey: apiMatch.whiteClientKey,
            blackTimeRemainingSec: apiMatch.blackTimeRemainingSec,
            blackClientKey: apiMatch.blackClientKey,
            timeControl: TimeControl.fromApi(apiMatch.timeControl),
            botName: "",
            result: matchResultFromApi(apiMatch.result),
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
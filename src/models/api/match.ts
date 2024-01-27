import {BoardState} from "../domain/board_state";
import {TimeControl} from "./time_control";
import {Templated} from "../../interfaces/templated";

export class Match extends Templated {
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
                }: Match) {
        super({});
        this.uuid = uuid;
        this.board = new BoardState(board);
        this.whiteClientId = whiteClientId;
        this.whiteTimeRemaining = whiteTimeRemaining;
        this.blackClientId = blackClientId;
        this.blackTimeRemaining = blackTimeRemaining;
        this.timeControl = new TimeControl(timeControl);
    }

    static template(): Object {
        return {
            uuid: "some-uuid",
            board: BoardState.template(),
            whiteClientId: "some-client1-key",
            whiteTimeRemaining: 100.0,
            blackClientId: "some-client2-key",
            blackTimeRemaining: 80.5,
            timeControl: TimeControl.template(),
        };
    }
}
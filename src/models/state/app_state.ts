import {Page} from "./page";
import {ApiMatchSchema} from "../api/match";
import {BoardState} from "../domain/board_state";
import {Move} from "../domain/move";
import {Challenge, newRapidTimeControl} from "../domain/challenge";
import {Match} from "../domain/match";

// const board = BoardState.fromFEN("3k4/3Q4/3K4/8/8/8/8/8 b - - 0 1");
const board = BoardState.getInitBoardState();
board.isTerminal = true;
const tempMatch = new Match({
    uuid: "asdf",
    board: board,
    whiteTimeRemainingSec: 10,
    whiteClientKey: "whiteClientId",
    blackTimeRemainingSec: 10,
    blackClientKey: "blackClientId",
    timeControl: newRapidTimeControl(),
});

export const initAppState = {
    page: Page.HOME,
    match: null,
    lastMove: null,
    // page: Page.BOARD,
    // match: tempMatch,
};

export class AppState {
    page: Page;
    match: Match | null;
    lastMove: Move | null;
    inboundChallenges: Challenge[];
    outboundChallenges: Challenge[];

    constructor(appState: Partial<AppState>) {
        this.page = appState.page || initAppState.page;
        this.match = appState.match || initAppState.match;
        this.lastMove = appState.lastMove || null;
        this.inboundChallenges = appState.inboundChallenges || [];
        this.outboundChallenges = appState.outboundChallenges || [];
    }

    merge(newAppState: Partial<AppState>): AppState {
        return new AppState({
            page: newAppState.page || this.page,
            match: newAppState.match || this.match,
            lastMove: newAppState.lastMove || this.lastMove,
            inboundChallenges: newAppState.inboundChallenges || this.inboundChallenges,
            outboundChallenges: newAppState.outboundChallenges || this.outboundChallenges,
        });
    }
}


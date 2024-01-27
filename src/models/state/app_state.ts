import {Page} from "../enums/page";
import {Match} from "../api/match";
import {BoardState} from "../game/board_state";
import {newBulletTimeControl, newRapidTimeControl, TimeControl} from "../api/time_control";
import {ChessPiece} from "../enums/chess_piece";
import {Move} from "../game/move";

// const board = BoardState.fromFEN("3k4/3Q4/3K4/8/8/8/8/8 b - - 0 1");
const board = BoardState.getInitBoardState();
board.isTerminal = true;
const tempMatch = new Match({
    uuid: "asdf",
    board: board,
    whiteTimeRemaining: 10,
    whiteClientId: "whiteClientId",
    blackTimeRemaining: 10,
    blackClientId: "blackClientId",
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

    constructor(appState: Partial<AppState>) {
        this.page = appState.page || initAppState.page;
        this.match = appState.match || initAppState.match;
        this.lastMove = appState.lastMove || null;
    }

    merge(appState: Partial<AppState>): AppState {
        return new AppState({
            page: appState.page || this.page,
            match: appState.match || this.match,
            lastMove: appState.lastMove || this.lastMove,
        });
    }
}


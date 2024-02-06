import {Page} from "./page";
import {BoardState} from "./board_state";
import {Move} from "./move";
import {Challenge, newBulletTimeControl, newRapidTimeControl} from "./challenge";
import {Match} from "./match";
import {AuthKeyset} from "./auth_keyset";

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
    auth: null,
    page: Page.HOME,
    match: null,
    lastMove: null,
    // page: Page.BOARD,
    // match: tempMatch,
    inboundChallenges: [
        new Challenge({
            uuid: "some-uuid",
            challengerKey: "some-client-key",
            challengedKey: "some-other-client-key",
            timeControl: newRapidTimeControl(),
            isChallengerWhite: true,
            isChallengerBlack: false,
            botName: "",
        })
    ],
    outboundChallenges: [
        new Challenge({
            uuid: "some-uuid",
            challengerKey: "some-client-key",
            challengedKey: "some-other-client-key",
            timeControl: newBulletTimeControl(),
            isChallengerWhite: true,
            isChallengerBlack: false,
            botName: "",
        })
    ],
};

export class AppState {
    auth: AuthKeyset | null;
    page: Page;
    match: Match | null;
    lastMove: Move | null;
    inboundChallenges: Challenge[];
    outboundChallenges: Challenge[];

    constructor(appState: Partial<AppState>) {
        this.auth = appState.auth || initAppState.auth;
        this.page = appState.page || initAppState.page;
        this.match = appState.match || initAppState.match;
        this.lastMove = appState.lastMove || null;
        this.inboundChallenges = appState.inboundChallenges || [];
        this.outboundChallenges = appState.outboundChallenges || [];
    }
}


import {Page} from "./page";
import {Move} from "./move";
import {Match} from "./match";
import {AuthKeyset} from "./auth_keyset";
import {Challenge} from "./challenge";
import {BoardState} from "./board_state";
import {ChessPiece} from "./chess_piece";
import {Square} from "./square";
import {newRapidTimeControl} from "./time_control";
import {MatchResult} from "./match_result";

export const initAppState = {
    // auth: new AuthKeyset({
    //     publicKey: "white-client-key",
    //     privateKey: "some-private-key",
    // }),
    // page: Page.BOARD,
    // match: new Match({
    //     uuid: "some-uuid",
    //     board: BoardState.fromFEN("r7/6P1/1k6/8/8/8/8/6RK w - - 1 63"),
    //     lastMove: new Move(ChessPiece.BLACK_ROOK, new Square(7, 1), new Square(8, 1), [], null, null),
    //     whiteTimeRemainingSec: 44.7,
    //     whiteClientKey: "white-client-key",
    //     blackTimeRemainingSec: 93.6,
    //     blackClientKey: "black-client-key",
    //     timeControl: newRapidTimeControl(),
    //     botName: "",
    //     result: MatchResult.IN_PROGRESS,
    // }),
    auth: null,
    page: Page.HOME,
    match: null,
    lastMove: null,
    inboundChallenges: [],
    outboundChallenges: [],
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
        this.inboundChallenges = appState.inboundChallenges || initAppState.inboundChallenges;
        this.outboundChallenges = appState.outboundChallenges || initAppState.outboundChallenges;
    }

    toLocalStorage(key: string) {
        if (this.auth) {
            this.auth.toLocalStorage(`${key}.auth`);
        }
    }

    static fromLocalStorage(key: string) {
        const appStateArgs: Partial<AppState> = {};

        appStateArgs.auth = AuthKeyset.fromLocalStorage(`${key}.auth`);

        return new AppState(appStateArgs);
    }
}


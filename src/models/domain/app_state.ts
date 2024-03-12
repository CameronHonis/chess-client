import {Page} from "./page";
import {Move} from "./move";
import {Match} from "./match";
import {AuthKeyset} from "./auth_keyset";
import {Challenge} from "./challenge";
import {Board} from "./board";
import {ChessPiece} from "./chess_piece";
import {Square} from "./square";
import {newRapidTimeControl} from "./time_control";
import {MatchResult} from "./match_result";


interface AppStateArgs {
    auth: AuthKeyset | null;
    page: Page;
    match: Match | null;
    lastMove: Move | null;
    inboundChallenges: Challenge[];
    outboundChallenges: Challenge[];
}

export class AppState {
    auth: AuthKeyset | null;
    page: Page;
    match: Match | null;
    lastMove: Move | null;
    inboundChallenges: Challenge[];
    outboundChallenges: Challenge[];

    constructor(args: AppStateArgs) {
        this.auth = args.auth;
        this.page = args.page;
        this.match = args.match;
        this.lastMove = args.lastMove;
        this.inboundChallenges = args.inboundChallenges;
        this.outboundChallenges = args.outboundChallenges;
    }

    toLocalStorage(key: string) {
        if (this.auth) {
            this.auth.toLocalStorage(`${key}.auth`);
        }
    }

    static fromLocalStorage(key: string) {
        return new AppState({
            auth: AuthKeyset.fromLocalStorage(`${key}.auth`) || null,
            page: Page.HOME,
            match: null,
            lastMove: null,
            inboundChallenges: [],
            outboundChallenges: []
        });
    }
}

export const initAppState = new AppState({
    auth: new AuthKeyset({
        publicKey: "white-client-key",
        privateKey: "some-private-key",
    }),
    page: Page.MATCH,
    match: new Match({
        uuid: "some-uuid",
        board: Board.fromFEN("r7/6P1/1k6/8/8/8/8/6RK b - - 1 63"),
        lastMove: new Move(ChessPiece.BLACK_ROOK, new Square(7, 1), new Square(8, 1), [], ChessPiece.EMPTY, ChessPiece.EMPTY),
        whiteTimeRemainingSec: 44.7,
        whiteClientKey: "white-client-key",
        blackTimeRemainingSec: 93.6,
        blackClientKey: "black-client-key",
        timeControl: newRapidTimeControl(),
        botName: "",
        result: MatchResult.IN_PROGRESS,
    }),
    // auth: null,
    // page: Page.HOME,
    // match: null,
    lastMove: null,
    inboundChallenges: [],
    outboundChallenges: [],
});

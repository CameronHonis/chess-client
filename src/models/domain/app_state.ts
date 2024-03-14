import {Page} from "./page";
import {Move} from "./move";
import {Match} from "./match";
import {AuthKeyset} from "./auth_keyset";
import {Challenge} from "./challenge";

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


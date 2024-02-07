import {Page} from "./page";
import {Move} from "./move";
import {Challenge} from "./challenge";
import {Match} from "./match";
import {AuthKeyset} from "./auth_keyset";

export const initAppState = {
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
}


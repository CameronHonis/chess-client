import {AppState} from "../models/state/app_state";
import {AppStateAction} from "../models/actions/app_state_action";
import {Page} from "../models/enums/page";
import {isMatchUpdateReceived} from "../models/actions/match_update_received";
import {isReturnedHome} from "../models/actions/returned_home";


export const appStateReducer = (state: AppState, action: AppStateAction): AppState => {
    if (isMatchUpdateReceived(action)) {
        return new AppState({
            page: Page.BOARD,
            match: action.payload.newMatch,
        });
    } else if (isReturnedHome(action)) {
        if (state.match && !state.match.board.isTerminal) {
            throw new Error("Cannot return home while match is in progress");
        }
        return new AppState({
            page: Page.HOME,
            match: null,
        });
    }
    throw new Error(`Uncaught action type: ${action.type}`);
}
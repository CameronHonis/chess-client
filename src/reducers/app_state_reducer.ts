import {AppState} from "../models/state/app_state";
import {AppStateAction} from "../models/actions/app_state_action";
import {Page} from "../models/state/page";
import {isMatchUpdateReceived} from "../models/actions/match_update_received";
import {isReturnedHome} from "../models/actions/returned_home";
import {isMoveReceived} from "../models/actions/move_received";


export const appStateReducer = (state: AppState, action: AppStateAction): AppState => {
    if (isMatchUpdateReceived(action)) {
        return state.merge({
            page: Page.BOARD,
            match: action.payload.newMatch,
        });
    } else if (isMoveReceived(action)) {
        return state.merge({
            lastMove: action.payload.move,
        });
    } else if (isReturnedHome(action)) {
        if (state.match && !state.match.board.isTerminal) {
            throw new Error("Cannot return home while match is in progress");
        }
        return state.merge({
            page: Page.HOME,
            match: null,
        });
    }
    throw new Error(`Uncaught action type: ${action.type}`);
}
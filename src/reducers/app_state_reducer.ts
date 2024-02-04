import {AppState} from "../models/state/app_state";
import {AppStateAction} from "../models/actions/app_state_action";
import {Page} from "../models/state/page";
import {isUpdateMatchAction} from "../models/actions/update_match_action";
import {isReturnHomeAction} from "../models/actions/return_home_action";
import {isIngestMoveAction} from "../models/actions/ingest_move_action";


export const appStateReducer = (state: AppState, action: AppStateAction): AppState => {
    if (isUpdateMatchAction(action)) {
        return state.merge({
            page: Page.BOARD,
            match: action.payload.newMatch,
        });
    } else if (isIngestMoveAction(action)) {
        return state.merge({
            lastMove: action.payload.move,
        });
    } else if (isReturnHomeAction(action)) {
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
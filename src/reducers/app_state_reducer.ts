import {AppState} from "../models/state/app_state";
import {AppStateAction} from "../models/actions/app_state_action";
import {Page} from "../models/enums/page";
import {isMatchUpdateReceived} from "../models/actions/match_update_received";


export const appStateReducer = (state: AppState, action: AppStateAction): AppState => {
    if (isMatchUpdateReceived(action)) {
        return new AppState({
            page: Page.BOARD,
            match: action.payload.newMatch,
        });
    }
    throw new Error(`Uncaught action type: ${action.type}`);
}
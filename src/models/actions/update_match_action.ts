import {AppStateAction, AppStateActionType} from "./app_state_action";
import {Match} from "../domain/match";

export interface UpdateMatchPayload {
    newMatch: Match | null;
}

export class UpdateMatchAction implements AppStateAction {
    type = AppStateActionType.UPDATE_MATCH;
    payload: UpdateMatchPayload;
    constructor(match: Match | null) {
        this.payload = {
            newMatch: match,
        };
    }
}

export function isUpdateMatchAction(action: AppStateAction): action is UpdateMatchAction {
    return action.type === AppStateActionType.UPDATE_MATCH;
}
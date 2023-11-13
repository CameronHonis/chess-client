import {AppStateAction, AppStateActionType} from "./app_state_action";
import {Match} from "../match";

export interface MatchUpdateReceivedPayload {
    newMatch: Match;
}

export class MatchUpdateReceived implements AppStateAction {
    type = AppStateActionType.MATCH_UPDATE_RECEIVED;
    payload: MatchUpdateReceivedPayload;
    constructor(payload: MatchUpdateReceivedPayload) {
        this.payload = payload;
    }
}

export function isMatchUpdateReceived(action: AppStateAction): action is MatchUpdateReceived {
    return action.type === AppStateActionType.MATCH_UPDATE_RECEIVED;
}
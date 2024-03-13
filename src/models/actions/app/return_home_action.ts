import {AppStateAction, AppStateActionType} from "./app_state_action";

export class ReturnHomeAction implements AppStateAction {
    type = AppStateActionType.RETURN_HOME;
    payload = null;
}

export function isReturnHomeAction(action: AppStateAction): action is ReturnHomeAction {
    return action.type === AppStateActionType.RETURN_HOME;
}
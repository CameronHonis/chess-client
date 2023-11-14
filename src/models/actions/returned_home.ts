import {AppStateAction, AppStateActionType} from "./app_state_action";

export class ReturnedHome implements AppStateAction {
    type = AppStateActionType.RETURNED_HOME;
    payload = null;
}

export function isReturnedHome(action: AppStateAction): action is ReturnedHome {
    return action.type === AppStateActionType.RETURNED_HOME;
}
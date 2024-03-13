import {BoardActionType} from "./board_action";
import {Action} from "../action";

export class ClearPremovesAction {
    type = BoardActionType.CLEAR_PREMOVES;
    payload = undefined;
}

export function isClearPremovesAction(action: Action): action is ClearPremovesAction {
    return action.type === BoardActionType.CLEAR_PREMOVES;
}

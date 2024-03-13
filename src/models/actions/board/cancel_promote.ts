import {BoardActionType} from "./board_action";
import {Action} from "../action";

export class CancelPromoteAction {
    type = BoardActionType.CANCEL_PROMOTE;
    payload = undefined;
}

export function isCancelPromoteAction(action: Action): action is CancelPromoteAction {
    return action.type === BoardActionType.CANCEL_PROMOTE;
}
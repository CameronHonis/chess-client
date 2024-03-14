import {BoardActionType} from "./board_action";
import {Action} from "../action";

export class ClearSelectionsAction {
    type = BoardActionType.CLEAR_SELECTIONS;
    payload = undefined;
}

export function isClearSelectionsAction(action: Action): action is ClearSelectionsAction {
    return action.type === BoardActionType.CLEAR_SELECTIONS;
}

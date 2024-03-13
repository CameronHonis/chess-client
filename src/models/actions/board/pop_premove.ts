import {BoardActionType} from "./board_action";
import {Action} from "../action";

export class PopPremoveAction {
    type = BoardActionType.POP_PREMOVE;
    payload = undefined;
}

export function isPopPremoveAction(action: Action): action is PopPremoveAction {
    return action.type === BoardActionType.POP_PREMOVE;
}

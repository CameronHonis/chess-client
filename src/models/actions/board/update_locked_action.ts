import {BoardActionType} from "./board_action";
import {Action} from "../action";

interface UpdateLockedPayload {
    isLocked: boolean;
}

export class UpdateLockedAction {
    type = BoardActionType.UPDATE_LOCKED;
    payload: UpdateLockedPayload;

    constructor(isLocked: boolean) {
        this.payload = {
            isLocked,
        };
    }
}

export function isUpdateLockedAction(action: Action): action is UpdateLockedAction {
    return action.type === BoardActionType.UPDATE_LOCKED;
}
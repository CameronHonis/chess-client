import {BoardActionType} from "./board_action";
import {Action} from "../action";

interface UpdatePerspectivePayload {
    isWhitePerspective: boolean;
}

export class UpdatePerspectiveAction {
    type = BoardActionType.UPDATE_PERSPECTIVE;
    payload: UpdatePerspectivePayload;

    constructor(isWhitePerspective: boolean) {
        this.payload = {
            isWhitePerspective,
        };
    }
}

export function isUpdatePerspectiveAction(action: Action): action is UpdatePerspectiveAction {
    return action.type === BoardActionType.UPDATE_PERSPECTIVE;
}
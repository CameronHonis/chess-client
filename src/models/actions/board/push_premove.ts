import {Move} from "../../domain/move";
import {BoardActionType} from "./board_action";
import {Action} from "../action";

interface PushPremovePayload {
    premove: Move;
}

export class PushPremoveAction {
    type = BoardActionType.PUSH_PREMOVE;
    payload: PushPremovePayload;

    constructor(premove: Move) {
        this.payload = {
            premove,
        };
    }
}

export function isPushPremoveAction(action: Action): action is PushPremoveAction {
    return action.type === BoardActionType.PUSH_PREMOVE;
}

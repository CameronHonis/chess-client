import {Square} from "../../domain/square";
import {BoardActionType} from "./board_action";
import {Action} from "../action";

interface LeftDraggingStartPayload {
    square: Square;
}

export class LeftDraggingStartAction {
    type = BoardActionType.LEFT_DRAGGING_START
    payload: LeftDraggingStartPayload

    constructor(square: Square) {
        this.payload = {
            square,
        };
    }
}

export function isLeftDraggingStartAction(action: Action): action is LeftDraggingStartAction {
    return action.type === BoardActionType.LEFT_DRAGGING_START;
}
import {Square} from "../../domain/square";
import {BoardActionType} from "./board_action";
import {Action} from "../action";

interface LeftDraggingStopPayload {
    dropSquare: Square | null;
}

export class LeftDraggingStopAction {
    type = BoardActionType.LEFT_DRAGGING_STOP;
    payload: LeftDraggingStopPayload;

    constructor(square: Square | null) {
        this.payload = {
            dropSquare: square,
        };
    }
}

export function isLeftDraggingStopAction(action: Action): action is LeftDraggingStopAction {
    return action.type === BoardActionType.LEFT_DRAGGING_STOP;
}
import {Square} from "../../domain/square";
import {BoardActionType} from "./board_action";
import {Action} from "../action";

interface RightClickSquareActionPayload {
    square: Square;
}

export class RightClickSquareAction {
    type = BoardActionType.RIGHT_CLICK_SQUARE;
    payload: RightClickSquareActionPayload;

    constructor(square: Square) {
        this.payload = {
            square,
        };
    }
}

export function isRightClickSquareAction(action: Action): action is RightClickSquareAction {
    return action.type === BoardActionType.RIGHT_CLICK_SQUARE;
}
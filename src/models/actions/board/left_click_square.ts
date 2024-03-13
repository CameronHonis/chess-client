import {Square} from "../../domain/square";
import {BoardActionType} from "./board_action";
import {Action} from "../action";

interface LeftClickSquareActionPayload {
    square: Square;
}

export class LeftClickSquareAction {
    type = BoardActionType.LEFT_CLICK_SQUARE;
    payload: LeftClickSquareActionPayload;

    constructor(square: Square) {
        this.payload = {
            square,
        };
    }
}

export function isLeftClickSquareAction(action: Action): action is LeftClickSquareAction {
    return action.type === BoardActionType.LEFT_CLICK_SQUARE;
}
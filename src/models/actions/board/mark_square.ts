import {Square} from "../../domain/square";
import {Action} from "../action";
import {BoardActionType} from "./board_action";
import {SquareColor} from "../../domain/square_color";

interface MarkSquareActionPayload {
    square: Square;
    color: SquareColor;
}

export class MarkSquareAction {
    type = BoardActionType.MARK_SQUARE;
    payload: MarkSquareActionPayload;

    constructor(square: Square, color: SquareColor) {
        this.payload = {
            square,
            color,
        };
    }
}

export function isMarkSquareAction(action: Action): action is MarkSquareAction {
    return action.type === BoardActionType.MARK_SQUARE;
}
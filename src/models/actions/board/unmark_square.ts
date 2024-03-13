import {Square} from "../../domain/square";
import {Action} from "../action";
import {BoardActionType} from "./board_action";

interface UnmarkSquareActionPayload {
    square: Square;
}

export class UnmarkSquareAction {
    type = BoardActionType.UNMARK_SQUARE;
    payload: UnmarkSquareActionPayload;

    constructor(square: Square) {
        this.payload = {
            square,
        };
    }
}

export function isUnMarkSquareAction(action: Action): action is UnmarkSquareAction {
    return action.type === BoardActionType.UNMARK_SQUARE;
}
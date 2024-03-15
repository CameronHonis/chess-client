import {Square} from "../../domain/square";
import {BoardActionType} from "./board_action";
import {Action} from "../action";

interface LeftDropPayload {
    dropSquare: Square | null;
}

export class LeftDropAction {
    type = BoardActionType.LEFT_DROP;
    payload: LeftDropPayload;

    constructor(square: Square | null) {
        this.payload = {
            dropSquare: square,
        };
    }
}

export function isLeftDropAction(action: Action): action is LeftDropAction {
    return action.type === BoardActionType.LEFT_DROP;
}
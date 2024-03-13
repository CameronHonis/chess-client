import {BoardActionType} from "./board_action";
import {Board} from "../../domain/board";
import {Action} from "../action";

interface UpdateBoardPayload {
    newBoard: Board;
}

export class UpdateBoardAction {
    type = BoardActionType.UPDATE_BOARD;
    payload: UpdateBoardPayload;

    constructor(newBoard: Board) {
        this.payload = {
            newBoard,
        };
    }
}

export function isUpdateBoardAction(action: Action): action is UpdateBoardAction {
    return action.type === BoardActionType.UPDATE_BOARD;
}
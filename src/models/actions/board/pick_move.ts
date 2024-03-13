import {ChessPiece} from "../../domain/chess_piece";
import {BoardActionType} from "./board_action";
import {Action} from "../action";

interface PickPromotePayload {
    piece: ChessPiece;
}

export class PickPromoteAction {
    type = BoardActionType.PICK_PROMOTE;
    payload: PickPromotePayload;

    constructor(piece: ChessPiece) {
        this.payload = {
            piece,
        };
    }
}

export function isPickPromoteAction(action: Action): action is PickPromoteAction {
    return action.type === BoardActionType.PICK_PROMOTE;
}
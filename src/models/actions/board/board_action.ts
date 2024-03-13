export enum BoardActionType {
    UPDATE_BOARD="UPDATE_BOARD",
    LEFT_CLICK_SQUARE="LEFT_CLICK_SQUARE",
    PICK_PROMOTE="PICK_PROMOTE",
    CANCEL_PROMOTE="CANCEL_PROMOTE",
    MARK_SQUARE="MARK_SQUARE",
    UNMARK_SQUARE="UNMARK_SQUARE",
    PUSH_PREMOVE="PUSH_PREMOVE",
    POP_PREMOVE="POP_PREMOVE",
    CLEAR_PREMOVES="CLEAR_PREMOVES",
}
export abstract class BoardAction {
    abstract type: BoardActionType;
    abstract payload: any;
}
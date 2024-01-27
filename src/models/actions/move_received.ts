import {AppStateAction, AppStateActionType} from "./app_state_action";
import {Move} from "../domain/move";
import {MatchUpdateReceived} from "./match_update_received";

export type MoveReceivedPayload = {
    move: Move;
}
export class MoveReceived implements AppStateAction {
    type = AppStateActionType.MOVE_RECEIVED;
    payload: MoveReceivedPayload;
    constructor(move: Move) {
        this.payload = {
            move
        };
    }
}

export function isMoveReceived(action: AppStateAction): action is MoveReceived {
    return action.type === AppStateActionType.MOVE_RECEIVED
}

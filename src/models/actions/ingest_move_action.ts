import {AppStateAction, AppStateActionType} from "./app_state_action";
import {Move} from "../domain/move";

export type IngestMovePayload = {
    move: Move;
}
export class IngestMoveAction implements AppStateAction {
    type = AppStateActionType.INGEST_MOVE;
    payload: IngestMovePayload;
    constructor(move: Move) {
        this.payload = {
            move
        };
    }
}

export function isIngestMoveAction(action: AppStateAction): action is IngestMoveAction {
    return action.type === AppStateActionType.INGEST_MOVE
}

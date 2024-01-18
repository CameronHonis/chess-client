import {Move} from "../../../move";

export interface MoveMessageContent {
    matchId: string;
    move: Move;
}

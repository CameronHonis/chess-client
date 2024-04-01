import {Move} from "../models/domain/move";
import {ChessPiece} from "../models/domain/chess_piece";
//@ts-ignore
import moveCheckAudio from "../res/audio/move-check.mp3";
//@ts-ignore
import captureAudio from "../res/audio/capture.mp3";
//@ts-ignore
import castleAudio from "../res/audio/castle.mp3";
//@ts-ignore
import moveAudio from "../res/audio/move.mp3";

export class AudioHelper {
    static playSoundFromMove(move: Move) {
        if (move.kingCheckingSquares.length > 0) {
            new Audio(moveCheckAudio).play();
        } else if (move.capturedPiece !== ChessPiece.EMPTY) {
            new Audio(captureAudio).play();
        } else if (move.isCastles()) {
            new Audio(castleAudio).play();
        } else {
            new Audio(moveAudio).play();
        }
    }
}
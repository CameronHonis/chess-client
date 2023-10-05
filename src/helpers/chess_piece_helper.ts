import {ChessPiece} from "../models/enums/chess_piece";

export class ChessPieceHelper {
    static isWhite(piece: ChessPiece): boolean {
        return piece === ChessPiece.WHITE_PAWN || piece === ChessPiece.WHITE_KNIGHT ||
            piece === ChessPiece.WHITE_BISHOP || piece === ChessPiece.WHITE_ROOK ||
            piece === ChessPiece.WHITE_QUEEN || piece === ChessPiece.WHITE_KING
    }

    static isBlack(piece: ChessPiece): boolean {
        if (piece === ChessPiece.EMPTY) return false;
        return !ChessPieceHelper.isWhite(piece);
    }

    static isPawn(piece: ChessPiece): boolean {
        return piece === ChessPiece.BLACK_PAWN || piece === ChessPiece.WHITE_PAWN;
    }

    static isKnight(piece: ChessPiece): boolean {
        return piece === ChessPiece.BLACK_KNIGHT || piece === ChessPiece.WHITE_KNIGHT;
    }

    static isBishop(piece: ChessPiece): boolean {
        return piece === ChessPiece.BLACK_BISHOP || piece === ChessPiece.WHITE_BISHOP;

    }
    static isRook(piece: ChessPiece): boolean {
        return piece === ChessPiece.BLACK_ROOK || piece === ChessPiece.WHITE_ROOK;
    }

    static isQueen(piece: ChessPiece): boolean {
        return piece === ChessPiece.BLACK_QUEEN || piece === ChessPiece.WHITE_QUEEN;
    }

    static isKing(piece: ChessPiece): boolean {
        return piece === ChessPiece.BLACK_KING || piece === ChessPiece.WHITE_KING;
    }
}



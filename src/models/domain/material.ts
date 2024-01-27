import {Square} from "./square";
import {ChessPiece} from "./chess_piece";
import {ChessPieceHelper} from "../../helpers/chess_piece_helper";

export class Material {
    whiteKingSquare: Square;
    blackKingSquare: Square;
    queens: [number, number];
    rooks: [number, number];
    lightSquareBishops: [number, number];
    darkSquareBishops: [number, number];
    knights: [number, number];
    pawns: [number, number];

    constructor(pieces: ChessPiece[][]) {
        this.whiteKingSquare = new Square(0, 0);
        this.blackKingSquare = new Square(0, 0);
        this.queens = [0, 0];
        this.rooks = [0, 0];
        this.lightSquareBishops = [0, 0];
        this.darkSquareBishops = [0, 0];
        this.knights = [0, 0];
        this.pawns = [0, 0];
        for (let rank = 1; rank < 9; rank++) {
            for (let file = 1; file < 9; file++) {
                const square = new Square(rank, file);
                const piece = pieces[rank - 1][file - 1];
                this.addPiece(piece, square);
            }
        }
    }

    addPiece(piece: ChessPiece, square: Square) {
        this._updateWithPieceAndAdder(piece, square, 1);
    }

    removePiece(piece: ChessPiece, square: Square) {
        if (ChessPieceHelper.isKing(piece)) return;
        this._updateWithPieceAndAdder(piece, square, -1);
    }

    _updateWithPieceAndAdder(piece: ChessPiece, square: Square, adder: number) {
        if (piece === ChessPiece.WHITE_KING) {
            this.whiteKingSquare = square;
        } else if (piece === ChessPiece.BLACK_KING) {
            this.blackKingSquare = square;
        } else if (piece === ChessPiece.WHITE_QUEEN) {
            this.queens[0] += adder;
        } else if (piece === ChessPiece.BLACK_QUEEN) {
            this.queens[1] += adder;
        } else if (piece === ChessPiece.WHITE_ROOK) {
            this.rooks[0] += adder;
        } else if (piece === ChessPiece.BLACK_ROOK) {
            this.rooks[1] += adder;
        } else if (piece === ChessPiece.WHITE_BISHOP) {
            if (square.isDarkSquare()) {
                this.darkSquareBishops[0] += adder;
            } else {
                this.lightSquareBishops[0] += adder;
            }
        } else if (piece === ChessPiece.BLACK_BISHOP) {
            if (square.isDarkSquare()) {
                this.darkSquareBishops[1] += adder;
            } else {
                this.lightSquareBishops[1] += adder;
            }
        } else if (piece === ChessPiece.WHITE_KNIGHT) {
            this.knights[0] += adder;
        } else if (piece === ChessPiece.BLACK_KNIGHT) {
            this.knights[1] += adder;
        } else if (piece === ChessPiece.WHITE_PAWN) {
            this.pawns[0] += adder;
        } else if (piece === ChessPiece.BLACK_PAWN) {
            this.pawns[1] += adder;
        }
    }
}
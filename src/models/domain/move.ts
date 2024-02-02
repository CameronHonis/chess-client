import {ChessPiece} from "./chess_piece";
import {Square} from "./square";
import {BoardState} from "./board_state";
import {ChessPieceHelper} from "../../helpers/chess_piece_helper";
import {GameHelper} from "../../helpers/game_helper";
import {ApiMove} from "../api/move";

export class Move {
    piece: ChessPiece
    startSquare: Square
    endSquare: Square
    kingCheckingSquares: Square[]
    capturedPiece: ChessPiece | null;
    pawnUpgradedTo: ChessPiece | null;

    constructor(piece: ChessPiece, startSquare: Square, endSquare: Square, pieceSquaresCheckingKing: Square[],
                pieceTaken: ChessPiece | null, pawnUpgradedTo: ChessPiece | null) {
        this.piece = piece;
        this.startSquare = startSquare;
        this.endSquare = endSquare;
        pieceSquaresCheckingKing.sort((a, b) => 10 * b.rank + b.file - 10 * a.rank - a.file);
        this.kingCheckingSquares = pieceSquaresCheckingKing;
        this.capturedPiece = pieceTaken;
        this.pawnUpgradedTo = pawnUpgradedTo;
    }

    addSquaresCheckingKing(square: Square | Square[]) {
        if (Array.isArray(square)) {
            this.kingCheckingSquares.push(...square);
        } else {
            this.kingCheckingSquares.push(square);
        }
        this.kingCheckingSquares.sort((a, b) => 10 * b.rank + b.file - 10 * a.rank - a.file);
    }

    getUpdatedBoardStatePieces(boardState: BoardState): BoardState {
        // NOTE: this generates invalid board states: if a valid board state is needed, use getResultingBoardState
        const rtnBoardState = boardState.copy();
        rtnBoardState.setPieceOnSquare(this.pawnUpgradedTo || this.piece, this.endSquare);
        rtnBoardState.setPieceOnSquare(ChessPiece.EMPTY, this.startSquare);
        if (boardState.enPassantSquare && ChessPieceHelper.isPawn(this.piece) && boardState.enPassantSquare.equalTo(this.endSquare)) {
            const enPassantedPawnSquare = boardState.enPassantSquare.copyWith({rank: this.startSquare.rank});
            rtnBoardState.setPieceOnSquare(ChessPiece.EMPTY, enPassantedPawnSquare);
        }
        const isCastleMove = ChessPieceHelper.isKing(this.piece) && this.startSquare.distanceFrom(this.endSquare) > 1;
        if (isCastleMove) {
            if (this.endSquare.equalTo(new Square(1, 7))) {
                rtnBoardState.setPieceOnSquare(ChessPiece.WHITE_ROOK, new Square(1, 6));
                rtnBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(1, 8));
            } else if (this.endSquare.equalTo(new Square(1, 3))) {
                rtnBoardState.setPieceOnSquare(ChessPiece.WHITE_ROOK, new Square(1, 4));
                rtnBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(1, 1));
            } else if (this.endSquare.equalTo(new Square(8, 7))) {
                rtnBoardState.setPieceOnSquare(ChessPiece.BLACK_ROOK, new Square(8, 6));
                rtnBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(8, 8));
            } else if (this.endSquare.equalTo(new Square(8, 3))) {
                rtnBoardState.setPieceOnSquare(ChessPiece.BLACK_ROOK, new Square(8, 4));
                rtnBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(8, 1));
            } else {
                throw new Error(`Invalid castle endSquare, ${JSON.stringify(this.endSquare)}`);
            }
        }
        return rtnBoardState;
    }

    // TODO: move into GameHelper
    getResultingBoardState(boardState: BoardState): BoardState {
        const rtnBoardState = this.getUpdatedBoardStatePieces(boardState);
        if (this.capturedPiece || ChessPieceHelper.isPawn(this.piece)) {
            rtnBoardState.halfMoveClockCount = 0;
        } else {
            rtnBoardState.halfMoveClockCount++;
        }
        if (!boardState.isWhiteTurn) {
            rtnBoardState.fullMoveCount++;
        }
        rtnBoardState.isWhiteTurn = !boardState.isWhiteTurn;
        if (ChessPieceHelper.isPawn(this.piece) && this.startSquare.distanceFrom(this.endSquare) === 2) {
            rtnBoardState.enPassantSquare = new Square(
                (this.startSquare.rank + this.endSquare.rank) / 2, this.startSquare.file);
        } else {
            rtnBoardState.enPassantSquare = null;
        }
        if (this.piece === ChessPiece.WHITE_ROOK && this.startSquare.equalTo(new Square(1, 1))) {
            rtnBoardState.canWhiteCastleQueenside = false;
        } else if (this.piece === ChessPiece.WHITE_ROOK && this.startSquare.equalTo(new Square(1, 8))) {
            rtnBoardState.canWhiteCastleKingside = false;
        } else if (this.piece === ChessPiece.BLACK_ROOK && this.startSquare.equalTo(new Square(8, 1))) {
            rtnBoardState.canBlackCastleQueenside = false;
        } else if (this.piece === ChessPiece.BLACK_ROOK && this.startSquare.equalTo(new Square(8, 8))) {
            rtnBoardState.canBlackCastleKingside = false;
        }
        if (this.piece === ChessPiece.WHITE_KING) {
            rtnBoardState.canWhiteCastleQueenside = false;
            rtnBoardState.canWhiteCastleKingside = false;
        }
        if (this.piece === ChessPiece.BLACK_KING) {
            rtnBoardState.canBlackCastleQueenside = false;
            rtnBoardState.canBlackCastleKingside = false;
        }
        const nextLegalMoves = rtnBoardState.getLegalMovesGroupedBySquareHash();
        if (Object.entries(nextLegalMoves).length === 0) {
            rtnBoardState.isTerminal = true;
            if (this.kingCheckingSquares.length !== 0) {
                rtnBoardState.isWhiteWinner = boardState.isWhiteTurn;
            }
        }
        if (rtnBoardState.halfMoveClockCount >= 50 || GameHelper.isForcedDraw(rtnBoardState.material)) {
            rtnBoardState.isTerminal = true;
        }
        return rtnBoardState;
    }

    copyWith({
                 piece,
                 startSquare,
                 endSquare,
                 kingCheckingSquares,
                 capturedPiece,
                 pawnUpgradedTo
             }: Partial<Move>): Move {
        return new Move(
            piece || this.piece,
            startSquare || this.startSquare.copy(),
            endSquare || this.endSquare.copy(),
            kingCheckingSquares || [...this.kingCheckingSquares],
            capturedPiece || this.capturedPiece,
            pawnUpgradedTo || this.pawnUpgradedTo
        );
    }

    copy(): Move {
        return this.copyWith({});
    }

    equalTo(otherMove: Move): boolean {
        if (this.kingCheckingSquares.length !== otherMove.kingCheckingSquares.length) return false;
        for (let i = 0; i < this.kingCheckingSquares.length; i++) {
            if (!this.kingCheckingSquares[i].equalTo(otherMove.kingCheckingSquares[i])) return false;
        }
        return this.piece === otherMove.piece &&
            this.startSquare.equalTo(otherMove.startSquare) &&
            this.endSquare.equalTo(otherMove.endSquare) &&
            this.capturedPiece === otherMove.capturedPiece &&
            this.pawnUpgradedTo === otherMove.pawnUpgradedTo;
    }

    static fromApi(apiMove: ApiMove): Move {
        return new Move(
            apiMove.piece,
            Square.fromApi(apiMove.startSquare),
            Square.fromApi(apiMove.endSquare),
            apiMove.kingCheckingSquares.map(Square.fromApi),
            apiMove.capturedPiece,
            apiMove.pawnUpgradedTo
        );
    }
}
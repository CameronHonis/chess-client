import {ChessPiece, ChessPieceFromApi} from "./chess_piece";
import {Square} from "./square";
import {Move} from "./move";
import {GameHelper} from "../../helpers/game_helper";
import {Material} from "./material";
import {ApiBoard} from "../api/board";

interface BoardStateConstructorArgs {

    pieces: ChessPiece[][]
    enPassantSquare?: Square | null;
    isWhiteTurn?: boolean
    canWhiteCastleQueenside?: boolean
    canWhiteCastleKingside?: boolean
    canBlackCastleQueenside?: boolean
    canBlackCastleKingside?: boolean
    halfMoveClockCount?: number
    fullMoveCount?: number
    isTerminal?: boolean
    isWhiteWinner?: boolean
    isBlackWinner?: boolean
    repetitionsByMiniFEN?: Map<string, number> | null
}

export class Board {
    pieces: ChessPiece[][]
    material: Material;
    enPassantSquare: Square | null;
    isWhiteTurn: boolean
    canWhiteCastleQueenside: boolean
    canWhiteCastleKingside: boolean
    canBlackCastleQueenside: boolean
    canBlackCastleKingside: boolean
    halfMoveClockCount: number
    fullMoveCount: number
    isTerminal: boolean
    isWhiteWinner: boolean
    isBlackWinner: boolean
    repetitionsByMiniFEN: Map<string, number>

    constructor({
                    pieces,
                    enPassantSquare = null,
                    isWhiteTurn = true,
                    canWhiteCastleQueenside = true,
                    canWhiteCastleKingside = true,
                    canBlackCastleQueenside = true,
                    canBlackCastleKingside = true,
                    halfMoveClockCount = 0,
                    fullMoveCount = 1,
                    isTerminal = false,
                    isWhiteWinner = false,
                    isBlackWinner = false,
                    repetitionsByMiniFEN = null,
                }: BoardStateConstructorArgs) {
        this._validate_pieces_shape(pieces);

        this.pieces = pieces;
        this.material = new Material(pieces);
        this.enPassantSquare = enPassantSquare;
        this.isWhiteTurn = isWhiteTurn;
        this.canWhiteCastleQueenside = canWhiteCastleQueenside;
        this.canWhiteCastleKingside = canWhiteCastleKingside;
        this.canBlackCastleQueenside = canBlackCastleQueenside;
        this.canBlackCastleKingside = canBlackCastleKingside;
        this.halfMoveClockCount = halfMoveClockCount;
        this.fullMoveCount = fullMoveCount;
        this.isTerminal = isTerminal;
        this.isWhiteWinner = isWhiteWinner;
        this.isBlackWinner = isBlackWinner;
        this.repetitionsByMiniFEN = repetitionsByMiniFEN || new Map();
    }


    // TODO: possibly add full board state validation?
    _validate_pieces_shape(pieces: ChessPiece[][]) {
        if (pieces.length !== 8) {
            throw new Error(`pieces does not have the expected amount of rows: exp (8) 
                vs. actual (${pieces.length})`);
        }
        for (let r = 0; r < pieces.length; r++) {
            if (pieces[r].length !== 8) {
                throw new Error(`pieces does not have the expected amount of columns at row ${r}. exp (8) 
                    vs actual (${pieces[r].length})`);
            }
        }
    }

    getPieceBySquare(square: Square): ChessPiece {
        return this.pieces[square.rank - 1][square.file - 1];
    }

    setPieceOnSquare(piece: ChessPiece, square: Square) {
        const pieceToRemove = this.getPieceBySquare(square);
        this.material.removePiece(pieceToRemove, square);
        this.pieces[square.rank - 1][square.file - 1] = piece;
        this.material.addPiece(piece, square);
    }

    getLegalMovesGroupedBySquareHash(): Record<string, Move[]> {
        const movesBySquareHash: Record<string, Move[]> = {};
        for (let rank = 1; rank < 9; rank++) {
            for (let file = 1; file < 9; file++) {
                const square = new Square(rank, file);
                const pieceMoves = GameHelper.getLegalMovesByBoardAndStartSquare(this, square);
                if (pieceMoves.length > 0) {
                    movesBySquareHash[square.hash()] = pieceMoves;
                }
            }
        }
        return movesBySquareHash;
    }

    getHasLegalMoves(): boolean {
        const legalMovesBySquareHash = this.getLegalMovesGroupedBySquareHash();
        for (let legalMoves of Object.values(legalMovesBySquareHash)) {
            if (legalMoves.length > 0) {
                return true;
            }
        }
        return false;
    }

    isDrawByRepetition(): boolean {
        for (let repetitions of Object.values(this.repetitionsByMiniFEN)) {
            if (repetitions >= 3) {
                return true;
            }
        }
        return false;
    }

    static getInitBoardState(): Board {
        const whitePawnRow = [ChessPiece.WHITE_PAWN, ChessPiece.WHITE_PAWN, ChessPiece.WHITE_PAWN, ChessPiece.WHITE_PAWN, ChessPiece.WHITE_PAWN, ChessPiece.WHITE_PAWN, ChessPiece.WHITE_PAWN, ChessPiece.WHITE_PAWN]
        const blackPawnRow = [ChessPiece.BLACK_PAWN, ChessPiece.BLACK_PAWN, ChessPiece.BLACK_PAWN, ChessPiece.BLACK_PAWN, ChessPiece.BLACK_PAWN, ChessPiece.BLACK_PAWN, ChessPiece.BLACK_PAWN, ChessPiece.BLACK_PAWN,]
        const emptyRow = [ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY]
        return new Board({
            pieces: [
                [ChessPiece.WHITE_ROOK, ChessPiece.WHITE_KNIGHT, ChessPiece.WHITE_BISHOP, ChessPiece.WHITE_QUEEN, ChessPiece.WHITE_KING, ChessPiece.WHITE_BISHOP, ChessPiece.WHITE_KNIGHT, ChessPiece.WHITE_ROOK],
                [...whitePawnRow],
                [...emptyRow],
                [...emptyRow],
                [...emptyRow],
                [...emptyRow],
                [...blackPawnRow],
                [ChessPiece.BLACK_ROOK, ChessPiece.BLACK_KNIGHT, ChessPiece.BLACK_BISHOP, ChessPiece.BLACK_QUEEN, ChessPiece.BLACK_KING, ChessPiece.BLACK_BISHOP, ChessPiece.BLACK_KNIGHT, ChessPiece.BLACK_ROOK],
            ],
        });
    }

    static fromFEN(fen: string): Board {
        const chessPiecesByFEN: { [fenChar: string]: ChessPiece[] } = {
            "p": [ChessPiece.BLACK_PAWN],
            "n": [ChessPiece.BLACK_KNIGHT],
            "b": [ChessPiece.BLACK_BISHOP],
            "r": [ChessPiece.BLACK_ROOK],
            "q": [ChessPiece.BLACK_QUEEN],
            "k": [ChessPiece.BLACK_KING],
            "P": [ChessPiece.WHITE_PAWN],
            "N": [ChessPiece.WHITE_KNIGHT],
            "B": [ChessPiece.WHITE_BISHOP],
            "R": [ChessPiece.WHITE_ROOK],
            "Q": [ChessPiece.WHITE_QUEEN],
            "K": [ChessPiece.WHITE_KING],
            "1": [ChessPiece.EMPTY],
            "2": [ChessPiece.EMPTY, ChessPiece.EMPTY],
            "3": [ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY],
            "4": [ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY],
            "5": [ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY],
            "6": [ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY,
                ChessPiece.EMPTY],
            "7": [ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY,
                ChessPiece.EMPTY, ChessPiece.EMPTY],
            "8": [ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY,
                ChessPiece.EMPTY, ChessPiece.EMPTY, ChessPiece.EMPTY],

        }
        const boardStateArgs: BoardStateConstructorArgs = {
            pieces: [[], [], [], [], [], [], [], []],
        };
        const fenSegs = fen.split(" ");
        if (fenSegs.length !== 6) {
            throw new Error(`Unexpected amount of segments in FEN. Exp (6) vs. Actual (${fenSegs.length})`);
        }
        for (let fenSegIdx = 0; fenSegIdx < fenSegs.length; fenSegIdx++) {
            const fenSeg = fenSegs[fenSegIdx];
            if (fenSegIdx === 0) {
                // pieces fen segment
                let rank = 8;
                for (let piece of fenSeg) {
                    if (piece === "/") {
                        rank--;
                        continue
                    }
                    if (!(piece in chessPiecesByFEN)) {
                        const algCoords = new Square(rank, boardStateArgs.pieces[rank].length + 1).toAlgebraicCoords();
                        throw new Error(`Invalid piece character in FEN, ${piece} at position ${algCoords}`);
                    }
                    boardStateArgs.pieces[rank - 1].push(...chessPiecesByFEN[piece]);
                }
            } else if (fenSegIdx === 1) {
                if (fenSeg.length !== 1) {
                    throw new Error(`Invalid turn indicator length in FEN, ${fenSeg}`);
                }
                if (fenSeg === "w") {
                    boardStateArgs.isWhiteTurn = true;
                } else if (fenSeg === "b") {
                    boardStateArgs.isWhiteTurn = false;
                } else {
                    throw new Error(`Invalid turn indicator in FEN, ${fenSeg}`)
                }
            } else if (fenSegIdx === 2) {
                boardStateArgs.canWhiteCastleKingside = false;
                boardStateArgs.canWhiteCastleQueenside = false;
                boardStateArgs.canBlackCastleKingside = false;
                boardStateArgs.canBlackCastleQueenside = false;
                if (fenSeg === "-" || fenSeg === "_") continue;
                for (let castleChar of fenSeg) {
                    if (castleChar === "K") {
                        boardStateArgs.canWhiteCastleKingside = true;
                    } else if (castleChar === "Q") {
                        boardStateArgs.canWhiteCastleQueenside = true;
                    } else if (castleChar === "k") {
                        boardStateArgs.canBlackCastleKingside = true;
                    } else if (castleChar === "q") {
                        boardStateArgs.canBlackCastleQueenside = true;
                    } else {
                        throw new Error(`Invalid castle specifier in FEN, ${castleChar}`);
                    }
                }
            } else if (fenSegIdx === 3) {
                if (fenSeg === "-" || fenSeg === "_") continue;
                boardStateArgs.enPassantSquare = Square.fromAlgebraicCoords(fenSeg);
            } else if (fenSegIdx === 4) {
                const halfMoveClockCountInt = Number.parseInt(fenSeg);
                if (!Number.isInteger(halfMoveClockCountInt)) {
                    throw new Error(`Non-number provided for halfmove clock in FEN, ${fenSeg}`);
                }
                boardStateArgs.halfMoveClockCount = halfMoveClockCountInt;
            } else if (fenSegIdx === 5) {
                const fullMoveCount = Number.parseInt(fenSeg);
                if (!Number.isInteger(fullMoveCount)) {
                    throw new Error(`Non-number provided for whole move count in FEN, ${fenSeg}`);
                }
                boardStateArgs.fullMoveCount = fullMoveCount;
            }
        }
        return new Board(boardStateArgs);
    }

    toFEN(): string {
        const fenCharByPiece = ["", "P", "N", "B", "R", "Q", "K", "p", "n", "b", "r", "q", "k"];
        const fenSegs: string[] = [];
        const fenPiecesSeg: string[] = [];
        let consecutiveEmptyCount = 0;
        for (let rank = 8; rank >= 1; rank--) {
            for (let file = 1; file < 9; file++) {
                const piece = this.getPieceBySquare(new Square(rank, file));
                if (piece === ChessPiece.EMPTY) {
                    consecutiveEmptyCount++;
                } else {
                    if (consecutiveEmptyCount) {
                        fenPiecesSeg.push(consecutiveEmptyCount.toString());
                        consecutiveEmptyCount = 0;
                    }
                    fenPiecesSeg.push(fenCharByPiece[piece])
                }
            }
            if (consecutiveEmptyCount > 0) {
                fenPiecesSeg.push(consecutiveEmptyCount.toString());
                consecutiveEmptyCount = 0;
            }
            fenPiecesSeg.push("/");
        }
        fenPiecesSeg.pop();
        fenSegs.push(fenPiecesSeg.join(""));

        fenSegs.push(this.isWhiteTurn ? "w" : "b");

        const fenCastleSeg: string[] = [];
        if (this.canWhiteCastleKingside) {
            fenCastleSeg.push("K");
        }
        if (this.canWhiteCastleQueenside) {
            fenCastleSeg.push("Q");
        }
        if (this.canBlackCastleKingside) {
            fenCastleSeg.push("k");
        }
        if (this.canBlackCastleQueenside) {
            fenCastleSeg.push("q");
        }
        fenSegs.push(fenCastleSeg.join("") || "-");

        if (this.enPassantSquare != null) {
            fenSegs.push(this.enPassantSquare.toAlgebraicCoords());
        } else {
            fenSegs.push("-");
        }

        fenSegs.push(this.halfMoveClockCount.toString());

        fenSegs.push(this.fullMoveCount.toString());

        return fenSegs.join(" ");
    }

    equalTo(otherBoardState: Board): boolean {
        for (let rank = 0; rank < this.pieces.length; rank++) {
            for (let file = 0; file < this.pieces[0].length; file++) {
                if (this.pieces[rank][file] !== otherBoardState.pieces[rank][file]) return false;
            }
        }

        if (this.enPassantSquare == null && otherBoardState.enPassantSquare != null) return false;
        if (otherBoardState.enPassantSquare == null && this.enPassantSquare != null) return false;
        if (this.enPassantSquare && !(this.enPassantSquare.equalTo(otherBoardState.enPassantSquare!))) return false;

        return this.isWhiteTurn === otherBoardState.isWhiteTurn &&
            this.canWhiteCastleKingside === otherBoardState.canWhiteCastleKingside &&
            this.canWhiteCastleQueenside === otherBoardState.canWhiteCastleQueenside &&
            this.canBlackCastleKingside === otherBoardState.canBlackCastleKingside &&
            this.canBlackCastleQueenside === otherBoardState.canBlackCastleQueenside &&
            this.halfMoveClockCount === otherBoardState.halfMoveClockCount &&
            this.fullMoveCount === otherBoardState.fullMoveCount;
    }

    copyWith({
                 pieces,
                 enPassantSquare,
                 isWhiteTurn,
                 canWhiteCastleKingside,
                 canWhiteCastleQueenside,
                 canBlackCastleKingside,
                 canBlackCastleQueenside,
                 halfMoveClockCount,
                 fullMoveCount
             }: Partial<Board>): Board {
        const piecesCopy = pieces || [
            [...this.pieces[0]],
            [...this.pieces[1]],
            [...this.pieces[2]],
            [...this.pieces[3]],
            [...this.pieces[4]],
            [...this.pieces[5]],
            [...this.pieces[6]],
            [...this.pieces[7]]
        ];
        const enPassantSquareCopy = enPassantSquare || (this.enPassantSquare && this.enPassantSquare.copyWith({}));
        const isWhiteTurnCopy = isWhiteTurn || this.isWhiteTurn;
        const canWhiteCastleKingsideCopy = canWhiteCastleKingside || this.canWhiteCastleKingside;
        const canWhiteCastleQueensideCopy = canWhiteCastleQueenside || this.canWhiteCastleQueenside;
        const canBlackCastleKingsideCopy = canBlackCastleKingside || this.canBlackCastleKingside;
        const canBlackCastleQueensideCopy = canBlackCastleQueenside || this.canBlackCastleQueenside;
        const halfMoveClockCountCopy = halfMoveClockCount || this.halfMoveClockCount;
        const fullMoveCountCopy = fullMoveCount || this.fullMoveCount;
        return new Board({
            pieces: piecesCopy,
            enPassantSquare: enPassantSquareCopy,
            isWhiteTurn: isWhiteTurnCopy,
            canWhiteCastleKingside: canWhiteCastleKingsideCopy,
            canWhiteCastleQueenside: canWhiteCastleQueensideCopy,
            canBlackCastleKingside: canBlackCastleKingsideCopy,
            canBlackCastleQueenside: canBlackCastleQueensideCopy,
            halfMoveClockCount: halfMoveClockCountCopy,
            fullMoveCount: fullMoveCountCopy
        });
    }

    copy(): Board {
        return this.copyWith({});
    }

    static fromApi(apiBoard: ApiBoard): Board {
        const isTerminal = apiBoard.result !== "in_progress";
        const isWhiteWinner = apiBoard.result.startsWith("white_wins");
        const isBlackWinner = apiBoard.result.startsWith("black_wins");
        return new Board({
            pieces: apiBoard.pieces.map(row => row.map(ChessPieceFromApi)),
            enPassantSquare: apiBoard.enPassantSquare ? Square.fromApi(apiBoard.enPassantSquare) : null,
            isWhiteTurn: apiBoard.isWhiteTurn,
            canWhiteCastleKingside: apiBoard.canWhiteCastleKingside,
            canWhiteCastleQueenside: apiBoard.canWhiteCastleQueenside,
            canBlackCastleKingside: apiBoard.canBlackCastleKingside,
            canBlackCastleQueenside: apiBoard.canBlackCastleQueenside,
            halfMoveClockCount: apiBoard.halfMoveClockCount,
            fullMoveCount: apiBoard.fullMoveCount,
            isTerminal,
            isWhiteWinner,
            isBlackWinner,
            repetitionsByMiniFEN: new Map(Object.entries(apiBoard.repetitionsByMiniFEN)),
        });
    }
}
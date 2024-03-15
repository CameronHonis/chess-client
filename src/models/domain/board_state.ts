import {Board} from "./board";
import {Square, SquareHash} from "./square";
import {Move} from "./move";
import {SquareColor} from "./square_color";
import {Queue} from "../../interfaces/queue";
import {EasyQueue} from "../../helpers/easy_queue";
import {TileVisualProps} from "../../components/tile";
import {ChessPiece} from "./chess_piece";
import {GameHelper} from "../../helpers/game_helper";
import {ChessPieceHelper} from "../../helpers/chess_piece_helper";

interface BoardStateArgs {
    isLocked: boolean;
    isWhitePerspective: boolean;
    board: Board;
    selectedSquare: Square | null;
    squareColorBySquareHash: Map<SquareHash, SquareColor>;
    selectedMoves: Move[];
    premoves: Queue<Move>;
    draggingSquare: Square | null;
}

export class BoardState {
    isLocked: boolean;
    isWhitePerspective: boolean;
    board: Board;
    selectedSquare: Square | null;
    squareColorBySquareHash: Map<SquareHash, SquareColor>;
    selectedMoves: Move[];
    premoves: Queue<Move>;
    draggingSquare: Square | null;


    constructor(args: BoardStateArgs) {
        this.isLocked = args.isLocked;
        this.isWhitePerspective = args.isWhitePerspective;
        this.board = args.board;
        this.selectedSquare = args.selectedSquare;
        this.squareColorBySquareHash = args.squareColorBySquareHash;
        this.selectedMoves = args.selectedMoves;
        this.premoves = args.premoves;
        this.draggingSquare = args.draggingSquare;
    }

    getSquareColor(square: Square): SquareColor | undefined {
        return this.squareColorBySquareHash.get(square.hash());
    }

    setSquareColor(square: Square, color: SquareColor | undefined) {
        if (color === undefined) {
            this.squareColorBySquareHash.delete(square.hash());
            return;
        }
        this.squareColorBySquareHash.set(square.hash(), color);
    }

    tileProps(lastMove: Move | null): TileVisualProps[] {
        const [board, premoveSquaresSet] = this.boardAndPremoveSquareHashesAfterPremoves();
        const isTurn = this.isTurn();
        const landSquares = this.landSquares(board, isTurn);
        const landSquaresSet = new Set(landSquares.map(s => s.hash()));
        const friendlySquares = this.friendlyPieceSquares(board);
        const interactableSquares = !this.isLocked ? [...landSquares, ...friendlySquares] : [];
        const interactableSquaresSet = new Set(interactableSquares.map(s => s.hash()));

        const tilePropss: TileVisualProps[] = [];
        for (let r = 1; r < 9; r++) {
            for (let c = 1; c < 9; c++) {
                let rank: number, file: number;
                if (this.isWhitePerspective) {
                    rank = 9 - r;
                    file = c;
                } else {
                    rank = r;
                    file = 9 - c;
                }
                const square = new Square(rank, file);
                const squareHash = square.hash();
                tilePropss.push({
                    square,
                    pieceType: board.getPieceBySquare(square),
                    isSelected: !!this.selectedSquare?.equalTo(square),
                    isDotVisible: landSquaresSet.has(squareHash),
                    isInteractable: interactableSquaresSet.has(squareHash),
                    isChecked: this.isChecked(board, square),
                    isLastMoveStart: !!lastMove?.startSquare.equalTo(square),
                    isLastMoveEnd: !!lastMove?.endSquare.equalTo(square),
                    isPremove: premoveSquaresSet.has(squareHash),
                    isBeingDragged: !!this.draggingSquare?.equalTo(square),
                });
            }
        }
        return tilePropss;
    }

    isTurn(): boolean {
        return this.board.isWhiteTurn === this.isWhitePerspective;
    }

    boardAndPremoveSquareHashesAfterPremoves(): [Board, Set<SquareHash>] {
        const board = this.board.copy();
        const premoveSquareHashes = new Set<SquareHash>();
        for (const move of this.premoves) {
            const piece = move.pawnUpgradedTo || move.piece;
            board.setPieceOnSquare(ChessPiece.EMPTY, move.startSquare);
            board.setPieceOnSquare(piece, move.endSquare);
            premoveSquareHashes.add(move.startSquare.hash());
            premoveSquareHashes.add(move.endSquare.hash());
        }
        return [board, premoveSquareHashes];
    }

    landSquares(board: Board, isTurn: boolean): Square[] {
        if (this.isLocked || !this.selectedSquare) {
            return [];
        }

        if (isTurn) {
            const legalMoves = GameHelper.getLegalMovesByBoardAndStartSquare(board, this.selectedSquare);
            return legalMoves.map(m => m.endSquare);
        } else {
            return GameHelper.getPossibleLandSquaresForSquare(board, this.selectedSquare);
        }
    }

    private friendlyPieceSquares(board: Board): Square[] {
        const squares: Square[] = [];
        for (let r = 1; r < 9; r++) {
            for (let c = 1; c < 9; c++) {
                const square = new Square(r, c);
                const piece = board.getPieceBySquare(square);
                if (piece === ChessPiece.EMPTY)
                    continue;
                if (ChessPieceHelper.isWhite(piece) === this.isWhitePerspective) {
                    squares.push(square);
                }
            }
        }
        return squares;
    }


    private isChecked(board: Board, square: Square): boolean {
        const piece = board.getPieceBySquare(square);
        if (!ChessPieceHelper.isKing(piece))
            return false;
        return GameHelper.getPieceSquaresCheckingKing(board, ChessPieceHelper.isWhite(piece)).length > 0
    }

    copy(): BoardState {
        return new BoardState({
            isLocked: this.isLocked,
            isWhitePerspective: this.isWhitePerspective,
            board: this.board,
            selectedSquare: this.selectedSquare?.copy() || null,
            squareColorBySquareHash: new Map(this.squareColorBySquareHash),
            selectedMoves: [...this.selectedMoves],
            premoves: this.premoves.copy(),
            draggingSquare: this.draggingSquare,
        });
    }

    equalTo(other: BoardState): boolean {
        if (!!this.selectedSquare !== !!other.selectedSquare)
            return false;
        if (this.selectedSquare && !this.selectedSquare.equalTo(other.selectedSquare!))
            return false;

        if (this.squareColorBySquareHash.size !== other.squareColorBySquareHash.size)
            return false;
        for (let [squareHash, squareColor] of this.squareColorBySquareHash.entries()) {
            if (squareColor !== other.squareColorBySquareHash.get(squareHash))
                return false;
        }

        if (this.selectedMoves.length !== other.selectedMoves.length)
            return false;
        for (let i = 0; i < this.selectedMoves.length; i++) {
            if (this.selectedMoves[i] !== other.selectedMoves[i])
                return false;
        }

        return this.isLocked === other.isLocked &&
            this.isWhitePerspective === other.isWhitePerspective &&
            this.board.equalTo(other.board) &&
            this.premoves.equalTo(other.premoves) &&
            this.draggingSquare === other.draggingSquare
    }

    static fromBoard(board: Board) {
        return new BoardState({
            isLocked: false,
            isWhitePerspective: true,
            board,
            selectedSquare: null,
            squareColorBySquareHash: new Map(),
            selectedMoves: [],
            premoves: new EasyQueue<Move>(),
            draggingSquare: null,
        });
    }
}
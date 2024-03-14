import {BoardAction} from "../models/actions/board/board_action";
import {BoardState} from "../models/domain/board_state";
import {isUpdateBoardAction} from "../models/actions/board/update_board";
import {isLeftClickSquareAction} from "../models/actions/board/left_click_square";
import {ChessPieceHelper} from "../helpers/chess_piece_helper";
import {ChessPiece} from "../models/domain/chess_piece";
import {GameHelper} from "../helpers/game_helper";
import {Move} from "../models/domain/move";
import {isPickPromoteAction} from "../models/actions/board/pick_move";
import {isCancelPromoteAction} from "../models/actions/board/cancel_promote";
import {isRightClickSquareAction} from "../models/actions/board/right_click_square";
import {Square} from "../models/domain/square";
import {isLeftDraggingStartAction} from "../models/actions/board/left_dragging_start_action";
import {isLeftDraggingStopAction} from "../models/actions/board/left_dragging_stop_action";
import {isClearSelectionsAction} from "../models/actions/board/clear_premoves";
import {isUpdatePerspectiveAction} from "../models/actions/board/update_perspective_action";
import {isUpdateLockedAction} from "../models/actions/board/update_locked_action";

export function boardStateReducer(state: BoardState, action: BoardAction): BoardState {
    const newState = state.copy();
    if (isUpdateBoardAction(action)) {
        const newBoard = action.payload.newBoard;
        newState.board = newBoard;
        newState.squareColorBySquareHash = new Map();
        newState.selectedMoves = [];
        if (state.selectedSquare !== null) {
            const pieceSelected = state.board.getPieceBySquare(state.selectedSquare);
            const newPieceSelected = newBoard.getPieceBySquare(state.selectedSquare);
            if (pieceSelected !== newPieceSelected) {
                newState.selectedSquare = null;
            }
        }
        if (newState.isTurn() && state.premoves.size()) {
            const premove = newState.premoves.pop();
            const legalMoves = GameHelper.getLegalMovesByBoardAndStartSquare(newBoard, premove.startSquare);
            const legalMoveMatch = legalMoves.find(move => {
                return move.endSquare.equalTo(premove.endSquare) && move.pawnUpgradedTo === premove.pawnUpgradedTo;
            });
            if (legalMoveMatch) {
                newState.selectedMoves = [legalMoveMatch];
            } else {
                newState.premoves.flush();
            }
        }
    } else if (isUpdatePerspectiveAction(action)) {
        newState.isWhitePerspective = action.payload.isWhitePerspective;
    } else if (isUpdateLockedAction(action)) {
        newState.isLocked = action.payload.isLocked;
    } else if (isLeftClickSquareAction(action)) {
        const square = action.payload.square;
        if (state.selectedSquare && state.selectedSquare.equalTo(square)) {
            newState.selectedSquare = null;
            newState.selectedMoves = [];
        } else {
            leftInteractSquare(state, newState, square);
        }
    } else if (isLeftDraggingStartAction(action)) {
        const square = action.payload.square;
        if (!state.selectedSquare || !state.selectedSquare.equalTo(square)) {
            leftInteractSquare(state, newState, square);
        }
        if (newState.selectedSquare) {
            const [board] = newState.boardAndPremoveSquareHashesAfterPremoves();
            newState.draggingPiece = board.getPieceBySquare(newState.selectedSquare);
        }
    } else if (isLeftDraggingStopAction(action)) {
        const dropSquare = action.payload.dropSquare;
        newState.draggingPiece = null;
        if (!dropSquare) {
            newState.selectedSquare = null;
            newState.selectedMoves = [];
        } else {
            if (state.selectedSquare?.equalTo(dropSquare)) {
                newState.selectedSquare = null;
                newState.selectedMoves = [];
            } else {
                leftInteractSquare(state, newState, dropSquare);
            }
        }
    } else if (isRightClickSquareAction(action)) {
        newState.premoves.flush();
        newState.selectedSquare = null;
        newState.selectedMoves = [];
    } else if (isPickPromoteAction(action)) {
        const move = newState.selectedMoves.find(selectedMove => {
            return selectedMove.pawnUpgradedTo === action.payload.piece;
        });
        if (!move)
            throw new Error(`No selected move for upgrade piece ${action.payload.piece}`);
        if (state.isTurn()) {
            newState.selectedMoves = [move];
        } else {
            newState.selectedMoves = [];
            newState.premoves.push(move);
        }
        newState.selectedSquare = null;
    } else if (isCancelPromoteAction(action)) {

    } else if (isClearSelectionsAction(action)) {
        newState.selectedSquare = null;
        newState.selectedMoves = [];
        newState.premoves.flush();
    } else {
        throw new Error(`Unhandled action type "${action.type}"`);
    }
    return newState;
}

function leftInteractSquare(oldState: BoardState, newState: BoardState, square: Square) {
    const [board] = oldState.boardAndPremoveSquareHashesAfterPremoves();
    const landPiece = board.getPieceBySquare(square);
    if (oldState.selectedSquare) {
        const selectedPiece = board.getPieceBySquare(oldState.selectedSquare);
        if (oldState.isTurn()) {
            const isFriendlyPiece = landPiece !== ChessPiece.EMPTY && ChessPieceHelper.isWhite(landPiece) === oldState.isWhitePerspective;
            if (isFriendlyPiece) {
                newState.selectedSquare = square;
            } else {
                const legalMoves = GameHelper.getLegalMovesByBoardAndStartSquare(board, oldState.selectedSquare);
                const matchingLegalMoves = legalMoves.filter(move => move.endSquare.equalTo(square));
                if (matchingLegalMoves.length > 0) {
                    newState.selectedMoves = matchingLegalMoves;
                    newState.selectedSquare = null;
                } else {
                    newState.selectedSquare = null;
                }
            }
        } else {
            const landSquares = GameHelper.getPossibleLandSquaresForSquare(board, oldState.selectedSquare);
            const isValidLandSquare = landSquares.some(landSquare => landSquare.equalTo(square));
            const isFriendlyPiece = landPiece !== ChessPiece.EMPTY && ChessPieceHelper.isWhite(landPiece) === oldState.isWhitePerspective;
            if (isValidLandSquare) {
                const isPromotion = ChessPieceHelper.isPawn(selectedPiece) && (square.rank === 8 || square.rank === 1);
                if (isPromotion) {
                    newState.selectedMoves = [
                        new Move(selectedPiece, oldState.selectedSquare, square, [], ChessPiece.EMPTY, oldState.isWhitePerspective ? ChessPiece.WHITE_QUEEN : ChessPiece.BLACK_QUEEN),
                        new Move(selectedPiece, oldState.selectedSquare, square, [], ChessPiece.EMPTY, oldState.isWhitePerspective ? ChessPiece.WHITE_ROOK : ChessPiece.BLACK_ROOK),
                        new Move(selectedPiece, oldState.selectedSquare, square, [], ChessPiece.EMPTY, oldState.isWhitePerspective ? ChessPiece.WHITE_BISHOP : ChessPiece.BLACK_BISHOP),
                        new Move(selectedPiece, oldState.selectedSquare, square, [], ChessPiece.EMPTY, oldState.isWhitePerspective ? ChessPiece.WHITE_KNIGHT : ChessPiece.BLACK_KNIGHT),
                    ];
                } else {
                    newState.premoves.push(new Move(selectedPiece, oldState.selectedSquare, square, [], ChessPiece.EMPTY, ChessPiece.EMPTY));
                    newState.selectedSquare = null;
                }
            } else if (isFriendlyPiece) {
                newState.selectedMoves = [];
                newState.selectedSquare = square;
            } else {
                newState.selectedSquare = null;
                newState.selectedMoves = [];
            }
        }
    } else {
        const isFriendlyPiece = landPiece !== ChessPiece.EMPTY && ChessPieceHelper.isWhite(landPiece) === oldState.isWhitePerspective;
        if (isFriendlyPiece) {
            newState.selectedSquare = square;
        }
    }
}
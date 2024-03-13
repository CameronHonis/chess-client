import {BoardAction} from "../models/actions/board/board_action";
import {BoardState} from "../models/domain/board_state";
import {isUpdateBoardAction} from "../models/actions/board/update_board";
import {isMarkSquareAction} from "../models/actions/board/mark_square";
import {isUnMarkSquareAction} from "../models/actions/board/unmark_square";
import {isPushPremoveAction} from "../models/actions/board/push_premove";
import {isLeftClickSquareAction} from "../models/actions/board/left_click_square";
import {ChessPieceHelper} from "../helpers/chess_piece_helper";
import {ChessPiece} from "../models/domain/chess_piece";
import {GameHelper} from "../helpers/game_helper";
import {Move} from "../models/domain/move";
import {isPopPremoveAction} from "../models/actions/board/pop_premove";
import {isPickPromoteAction} from "../models/actions/board/pick_move";
import {isCancelPromoteAction} from "../models/actions/board/cancel_promote";

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
    } else if (isLeftClickSquareAction(action)) {
        const square = action.payload.square;
        const landPiece = newState.board.getPieceBySquare(square);
        if (state.selectedSquare) {
            const selectedPiece = newState.board.getPieceBySquare(state.selectedSquare);
            if (state.selectedSquare.equalTo(square)) {
                newState.selectedSquare = null;
            } else if (landPiece !== ChessPiece.EMPTY && ChessPieceHelper.isWhite(landPiece) === state.isWhitePerspective) {
                newState.selectedSquare = square;
            } else {
                if (state.isTurn()) {
                    const legalMoves = GameHelper.getLegalMovesByBoardAndStartSquare(state.board, state.selectedSquare);
                    const matchingLegalMoves = legalMoves.filter(move => move.endSquare.equalTo(square));
                    if (matchingLegalMoves.length > 0) {
                        newState.selectedMoves = matchingLegalMoves;
                    } else {
                        newState.selectedSquare = null;
                    }
                } else {
                    const landSquares = GameHelper.getPossibleLandSquaresForSquare(state.board, state.selectedSquare);
                    const isValidLandSquare = landSquares.some(landSquare => landSquare.equalTo(square));
                    if (isValidLandSquare) {
                        const isPromotion = ChessPieceHelper.isPawn(selectedPiece) && (square.rank === 8 || square.rank === 1);
                        if (isPromotion) {
                            newState.selectedMoves = [
                                new Move(selectedPiece, state.selectedSquare, square, [], ChessPiece.EMPTY, state.isWhitePerspective ? ChessPiece.WHITE_QUEEN : ChessPiece.BLACK_QUEEN),
                                new Move(selectedPiece, state.selectedSquare, square, [], ChessPiece.EMPTY, state.isWhitePerspective ? ChessPiece.WHITE_ROOK : ChessPiece.BLACK_ROOK),
                                new Move(selectedPiece, state.selectedSquare, square, [], ChessPiece.EMPTY, state.isWhitePerspective ? ChessPiece.WHITE_BISHOP : ChessPiece.BLACK_BISHOP),
                                new Move(selectedPiece, state.selectedSquare, square, [], ChessPiece.EMPTY, state.isWhitePerspective ? ChessPiece.WHITE_KNIGHT : ChessPiece.BLACK_KNIGHT),
                            ];
                        } else {
                            newState.premoves.push(new Move(selectedPiece, state.selectedSquare, square, [], ChessPiece.EMPTY, ChessPiece.EMPTY));
                            newState.selectedSquare = null;
                        }
                    }
                }
            }
        } else {
            if (landPiece !== ChessPiece.EMPTY && ChessPieceHelper.isWhite(landPiece) === state.isWhitePerspective) {
                newState.selectedSquare = square;
            }
        }
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
    } else if (isCancelPromoteAction(action)) {

    } else {
        throw new Error(`Unhandled action type "${action.type}"`);
    }
    return newState;
}
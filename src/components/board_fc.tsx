import React from "react";
import "../styles/board.css";
import {Tile} from "./tile";
import {Square} from "../models/domain/square";
import {ChessPiece} from "../models/domain/chess_piece";
import {Move} from "../models/domain/move";
import {MouseButton, ReactComp} from "../types";
import {PromoteOverlay} from "./promote_overlay";
import {boardStateReducer} from "../reducers/board_state_reducer";
import {Board} from "../models/domain/board";
import {BoardState} from "../models/domain/board_state";
import {EasyQueue} from "../helpers/easy_queue";
import {LeftClickSquareAction} from "../models/actions/board/left_click_square";
import {PickPromoteAction} from "../models/actions/board/pick_move";
import {CancelPromoteAction} from "../models/actions/board/cancel_promote";
import {UpdateBoardAction} from "../models/actions/board/update_board";
import {RightClickSquareAction} from "../models/actions/board/right_click_square";
import {LeftDraggingStartAction} from "../models/actions/board/left_dragging_start_action";
import {LeftDraggingStopAction} from "../models/actions/board/left_dragging_stop_action";
import {ClearSelectionsAction} from "../models/actions/board/clear_premoves";
import {UpdatePerspectiveAction} from "../models/actions/board/update_perspective_action";
import {UpdateLockedAction} from "../models/actions/board/update_locked_action";

export interface BoardProps {
    isLocked: boolean;
    isWhitePerspective: boolean;
    board: Board;
    lastMove: Move | null;
    sendMove: (move: Move) => void;
}

export const BoardFC: React.FC<BoardProps> = ({isLocked, isWhitePerspective, board, lastMove, sendMove}) => {
    const [state, dispatch] = React.useReducer(boardStateReducer, new BoardState({
        isLocked,
        isWhitePerspective,
        board,
        selectedSquare: null,
        squareColorBySquareHash: new Map(),
        selectedMoves: [],
        premoves: new EasyQueue(),
        draggingPiece: null,
    }));

    React.useEffect(() => {
        const onKeyPress = (ev: KeyboardEvent) => {
            if (ev.key === "Escape") {
                dispatch(new ClearSelectionsAction());
            }
        }
        document.addEventListener("keyup", onKeyPress);

        return () => window.removeEventListener("keypress", onKeyPress);
    }, []);

    React.useEffect(() => {
        dispatch(new UpdateBoardAction(board));
    }, [board]);

    React.useEffect(() => {
        dispatch(new UpdatePerspectiveAction(isWhitePerspective));
    }, [isWhitePerspective]);

    React.useEffect(() => {
        dispatch(new UpdateLockedAction(isLocked));
    }, [isLocked]);

    React.useEffect(() => {
        if (state.selectedMoves.length === 1) {
            const move = state.selectedMoves[0];
            sendMove(move);
        }
    }, [sendMove, state.selectedMoves]);

    React.useEffect(() => {
        if (state.selectedSquare && state.draggingPiece) {
            window.services.boardAnimator.holdPiece(state.selectedSquare);
        } else {
            window.services.boardAnimator.dropPiece();
        }
    }, [state.selectedSquare, state.draggingPiece]);

    const onPromote = React.useCallback((piece: ChessPiece) => {
        dispatch(new PickPromoteAction(piece));
    }, []);

    const onCancelPromote = React.useCallback(() => {
        dispatch(new CancelPromoteAction());
    }, []);

    const onTileClick = React.useCallback((ev: React.MouseEvent, square: Square) => {
        if (ev.button === MouseButton.LEFT) {
            dispatch(new LeftClickSquareAction(square));
        } else if (ev.button === MouseButton.RIGHT) {
            dispatch(new RightClickSquareAction(square));
            ev.preventDefault();
        }
    }, []);

    const onTileDragStart = React.useCallback((button: MouseButton, square: Square) => {
        if (button === MouseButton.LEFT) {
            // window.services.boardAnimator.holdPiece(square);
            dispatch(new LeftDraggingStartAction(square));
        }
    }, []);

    const onTileDrop = React.useCallback((button: MouseButton, dropSquare: Square) => {
        if (button === MouseButton.LEFT) {
            if (!state.selectedSquare)
                return;
            // window.services.boardAnimator.dropPiece();
            dispatch(new LeftDraggingStopAction(dropSquare));
        }
    }, [state.selectedSquare]);

    const tiles = React.useMemo((): ReactComp<typeof Tile>[] => {
        return state.tileProps(lastMove).map((tileProps, idx) => {
            return <Tile {...tileProps}
                         onClick={onTileClick}
                         onDragStart={onTileDragStart}
                         onDrop={onTileDrop}
                         key={idx}
            />
        });
    }, [state, lastMove, onTileClick, onTileDragStart, onTileDrop]);

    const promoteOverlay = React.useMemo(() => {
        if (state.selectedMoves.length < 2)
            return null;
        return <PromoteOverlay isWhite={isWhitePerspective} move={state.selectedMoves[0]} onPromote={onPromote}
                               onCancel={onCancelPromote}/>;
    }, [onPromote, onCancelPromote, state.selectedMoves, isWhitePerspective]);

    return <div className={"BoardFrame"}>
        <div className={"Board"}>
            {tiles}
            {promoteOverlay}
        </div>
    </div>
}
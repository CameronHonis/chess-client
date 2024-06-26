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
import {LeftDropAction} from "../models/actions/board/left_dragging_stop_action";
import {ClearSelectionsAction} from "../models/actions/board/clear_premoves";
import {UpdatePerspectiveAction} from "../models/actions/board/update_perspective_action";
import {UpdateLockedAction} from "../models/actions/board/update_locked_action";
import {AnimTile} from "./anim_tile";
import {AudioHelper} from "../helpers/audio_helper";

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
        draggingSquare: null,
        lastMoveDragged: false,
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
        if (state.selectedSquare && state.draggingSquare) {
            window.services.boardAnimator.holdPiece(state.selectedSquare);
        } else {
            window.services.boardAnimator.dropPiece();
        }
    }, [state.selectedSquare, state.draggingSquare]);

    React.useEffect(() => {
        if (!lastMove)
            return;
        AudioHelper.playSoundFromMove(lastMove);
    }, [lastMove]);

    const onPromote = React.useCallback((piece: ChessPiece) => {
        dispatch(new PickPromoteAction(piece));
    }, []);

    const onCancelPromote = React.useCallback(() => {
        dispatch(new CancelPromoteAction());
    }, []);

    const onTileClick = React.useCallback((button: MouseButton, square: Square) => {
        if (button === MouseButton.LEFT) {
            dispatch(new LeftClickSquareAction(square));
        } else if (button === MouseButton.RIGHT) {
            dispatch(new RightClickSquareAction(square));
        }
    }, []);

    const onTileDragStart = React.useCallback((button: MouseButton, square: Square) => {
        if (button === MouseButton.LEFT) {
            dispatch(new LeftDraggingStartAction(square));
        }
    }, []);

    const onTileDrop = React.useCallback((button: MouseButton, dropSquare: Square | null) => {
        if (button === MouseButton.LEFT) {
            dispatch(new LeftDropAction(dropSquare));
        }
    }, []);

    React.useEffect(() => {
        const squareFromDropNode = (node: HTMLElement): Square | null => {
            let currNode = node as HTMLElement | null;
            while (currNode && currNode.classList) {
                const isTile = currNode.classList.contains("Tile");
                if (isTile) {
                    const dropSquareHash = currNode.id.substring(4);
                    return Square.fromHash(dropSquareHash);
                }
                const isBody = currNode.nodeName === "BODY";
                if (isBody)
                    return null;

                currNode = currNode.parentNode as HTMLElement | null;
            }
            return null;
        }
        const onMouseUp = (ev: MouseEvent) => {
            let currNode = ev.target as HTMLElement;
            const dropSquare = squareFromDropNode(currNode);
            if (dropSquare) {
                onTileDrop(ev.button, dropSquare);
            } else {
                onTileDrop(ev.button, null);
            }
        };
        const onTouchEnd = (ev: TouchEvent) => {
            const touch = ev.changedTouches[0];
            const elem = document.elementFromPoint(touch.clientX, touch.clientY);
            if (!elem)
                return onTileDrop(MouseButton.LEFT, null);
            const dropSquare = squareFromDropNode(elem as HTMLElement);
            if (dropSquare) {
                onTileDrop(MouseButton.LEFT, dropSquare);
            } else {
                onTileDrop(MouseButton.LEFT, null);
            }
        }

        if (state.draggingSquare) {
            document.addEventListener("mouseup", onMouseUp);
            document.addEventListener("touchend", onTouchEnd, {passive: true});
        } else {
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("touchend", onTouchEnd);
        }

        return () => {
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("touchend", onTouchEnd);
        }
    }, [onTileDrop, state.draggingSquare]);

    const tiles = React.useMemo((): ReactComp<typeof Tile>[] => {
        return state.tileProps(lastMove).map((tileProps, idx) => {
            return <Tile {...tileProps}
                         onClick={onTileClick}
                         onDragStart={onTileDragStart}
                         key={idx}
            />
        });
    }, [state, lastMove, onTileClick, onTileDragStart]);

    const promoteOverlay = React.useMemo(() => {
        if (state.selectedMoves.length < 2)
            return null;
        return <PromoteOverlay isWhite={isWhitePerspective} move={state.selectedMoves[0]} onPromote={onPromote}
                               onCancel={onCancelPromote}/>;
    }, [onPromote, onCancelPromote, state.selectedMoves, isWhitePerspective]);

    const draggingPieceAnimTile = React.useMemo(() => {
        if (!state.draggingSquare)
            return null;
        const [boardAfterPremoves] = state.boardAndPremoveSquareHashesAfterPremoves();
        const draggingPiece = boardAfterPremoves.getPieceBySquare(state.draggingSquare);
        return <AnimTile piece={draggingPiece} id={"DraggingTile"}/>;
    }, [state]);

    const moveAnimTile = React.useMemo(() => {
        if (!lastMove || state.lastMoveDragged)
            return null;
        window.services.boardAnimator.movePiece(lastMove);
        return <AnimTile piece={lastMove.piece} id={"MoveTile"}/>;
    }, [lastMove, state.lastMoveDragged]);

    return <div className={"Board"}>
        {tiles}
        {promoteOverlay}
        {draggingPieceAnimTile}
        {moveAnimTile}
    </div>
}
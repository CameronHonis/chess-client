import React, {useState} from "react";
import "../styles/board.css";
import {Tile} from "./tile";
import {Square} from "../models/domain/square";
import {ChessPiece} from "../models/domain/chess_piece";
import {Move} from "../models/domain/move";
import {ReactComp} from "../types";
import {AnimTile} from "./anim_tile";
import {PromoteOverlay} from "./promote_overlay";
import {boardStateReducer} from "../reducers/board_state_reducer";
import {Board} from "../models/domain/board";
import {BoardState} from "../models/domain/board_state";
import {EasyQueue} from "../helpers/easy_queue";
import {LeftClickSquareAction} from "../models/actions/board/left_click_square";
import {PickPromoteAction} from "../models/actions/board/pick_move";
import {CancelPromoteAction} from "../models/actions/board/cancel_promote";
import {UpdateBoardAction} from "../models/actions/board/update_board";

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
        lastMove,
        selectedSquare: null,
        squareColorBySquareHash: new Map(),
        selectedMoves: [],
        premoves: new EasyQueue(),
    }));

    React.useEffect(() => {
        dispatch(new UpdateBoardAction(board));
    }, [board]);

    React.useEffect(() => {
        if (state.selectedMoves.length === 1) {
            const move = state.selectedMoves[0];
            sendMove(move);
        }
    }, [sendMove, state.selectedMoves]);

    const [draggingSquare, setDraggingSquare] = useState<Square | null>(null);

    React.useEffect(() => {
        if (!draggingSquare) {
            window.services.boardAnimator.dropPiece();
            return;
        }
        window.services.boardAnimator.holdPiece(draggingSquare);
    }, [draggingSquare]);

    // React.useEffect(() => {
    //     if (isTurn) {
    //         try {
    //             const moves = state.getMovesFromPremove();
    //             if (moves.length > 1) {
    //                 dispatch(new SelectMovesAction(moves));
    //             } else {
    //                 const move = moves[0];
    //                 sendMove(move);
    //                 dispatch(new PopPremoveAction());
    //             }
    //         } catch {
    //             dispatch(new ClearPremovesAction());
    //         }
    //     }
    // }, [state, isTurn]);
    //
    // const playMove = React.useCallback((move: Move) => {
    //     if (isTurn) {
    //         sendMove(move);
    //     } else {
    //         dispatch(new PushPremoveAction(move));
    //     }
    // }, [isTurn]);

    const onPromote = React.useCallback((piece: ChessPiece) => {
        dispatch(new PickPromoteAction(piece));
    }, []);

    const onCancelPromote = React.useCallback(() => {
        dispatch(new CancelPromoteAction());
    }, []);

    const onTileClick = React.useCallback((square: Square) => {
        dispatch(new LeftClickSquareAction(square));
    }, []);

    const tiles = React.useMemo((): ReactComp<typeof Tile>[] => {
        return state.tileProps().map((tileProps, idx) => {
            return <Tile {...tileProps} onClick={onTileClick} key={idx}/>
        });
    }, [onTileClick, state]);

    const animTile = React.useMemo((): ReactComp<typeof AnimTile> | null => {
        if (!lastMove)
            return null;
        return <AnimTile piece={lastMove.piece} isDragging={false}/>;
    }, [lastMove]);

    const draggingTile = React.useMemo((): ReactComp<typeof Tile> | null => {
        if (draggingSquare === null)
            return null;
        return <AnimTile piece={board.getPieceBySquare(draggingSquare)} isDragging/>;
    }, [board, draggingSquare]);

    const promoteOverlay = React.useMemo(() => {
        if (state.selectedMoves.length < 2)
            return null;
        return <PromoteOverlay isWhite={isWhitePerspective} move={state.selectedMoves[0]} onPromote={onPromote}
                               onCancel={onCancelPromote}/>;
    }, [onPromote, onCancelPromote, state.selectedMoves, isWhitePerspective]);

    return <div className={"BoardFrame"}>
        <div className={"Board"}>
            {tiles}
            {animTile}
            {draggingTile}
            {promoteOverlay}
        </div>
    </div>
}
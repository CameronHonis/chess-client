import React from "react";
import "../styles/tile.css";
import {Pawn} from "./pieces/pawn_svg";
import {Knight} from "./pieces/knight_svg";
import {Bishop} from "./pieces/bishop_svg";
import {Rook} from "./pieces/rook_svg";
import {Queen} from "./pieces/queen_svg";
import {King} from "./pieces/king_svg";
import {ChessPiece} from "../models/domain/chess_piece";
import {ChessPieceHelper} from "../helpers/chess_piece_helper";
import {Square} from "../models/domain/square";
import {MouseButton} from "../types";

export interface TileVisualProps {
    square: Square;
    pieceType: ChessPiece;
    isSelected: boolean;
    isDotVisible: boolean;
    isInteractable: boolean;
    isChecked: boolean;
    isLastMoveStart: boolean;
    isLastMoveEnd: boolean;
    isPremove: boolean;
    isBeingDragged: boolean;
}

export interface TileFunctionalProps {
    onClick: (button: MouseButton, square: Square) => void;
    onDragStart: (button: MouseButton, square: Square) => void;
}

export type TileProps = TileVisualProps & TileFunctionalProps;

export const Tile: React.FC<TileProps> = (props) => {
    const {
        square,
        pieceType,
        isSelected,
        isDotVisible,
        isInteractable,
        isChecked,
        isLastMoveStart,
        isLastMoveEnd,
        isPremove,
        isBeingDragged,
        onClick: _onClick,
        onDragStart: _onDragStart,
    } = props;

    const [didClickDrag, setDidClickDrag] = React.useState(false);

    const onDragStart = React.useCallback((ev: React.DragEvent<HTMLImageElement>) => {
        ev.preventDefault();
        setDidClickDrag(true);
        _onDragStart(ev.button, square);
    }, [_onDragStart, square]);

    const onClick = React.useCallback((ev: React.MouseEvent) => {
        if (ev.button === MouseButton.RIGHT)
            ev.preventDefault();
        if (!didClickDrag) {
            _onClick(ev.button, square);
        }
    }, [didClickDrag, _onClick, square]);

    const isWhite = ChessPieceHelper.isWhite(pieceType)
    let tileIcon: React.JSX.Element | null = null;
    if (pieceType === ChessPiece.WHITE_PAWN || pieceType === ChessPiece.BLACK_PAWN) {
        tileIcon = <Pawn isWhite={isWhite}
                         onDragStart={onDragStart}/>
    } else if (pieceType === ChessPiece.WHITE_KNIGHT || pieceType === ChessPiece.BLACK_KNIGHT) {
        tileIcon = <Knight isWhite={isWhite}
                           onDragStart={onDragStart}/>
    } else if (pieceType === ChessPiece.WHITE_BISHOP || pieceType === ChessPiece.BLACK_BISHOP) {
        tileIcon = <Bishop isWhite={isWhite}
                           onDragStart={onDragStart}/>
    } else if (pieceType === ChessPiece.WHITE_ROOK || pieceType === ChessPiece.BLACK_ROOK) {
        tileIcon = <Rook isWhite={isWhite}
                         onDragStart={onDragStart}/>
    } else if (pieceType === ChessPiece.WHITE_QUEEN || pieceType === ChessPiece.BLACK_QUEEN) {
        tileIcon = <Queen isWhite={isWhite}
                          onDragStart={onDragStart}/>
    } else if (pieceType === ChessPiece.WHITE_KING || pieceType === ChessPiece.BLACK_KING) {
        tileIcon = <King isWhite={isWhite}
                         onDragStart={onDragStart}/>
    }

    const classNames = React.useMemo(() => {
        const classNames = [];
        classNames.push("Tile");
        classNames.push(square.isDarkSquare() ? "DarkSquare" : "LightSquare");
        if (isSelected)
            classNames.push("Selected");
        if (isDotVisible)
            classNames.push("Dotted");
        if (isInteractable)
            classNames.push("Interactable");
        if (isChecked)
            classNames.push("Checked");
        if (isLastMoveStart)
            classNames.push("LastMoveStart");
        if (isLastMoveEnd)
            classNames.push("LastMoveEnd");
        if (isPremove)
            classNames.push("Premove");
        if (isBeingDragged)
            classNames.push("Dragging")
        return classNames;
    }, [square, isSelected, isDotVisible, isInteractable, isChecked, isLastMoveStart, isLastMoveEnd, isPremove, isBeingDragged]);

    return <div
        className={classNames.join(" ")}
        id={`Tile${square.hash()}`}
        onMouseDown={() => setDidClickDrag(false)}
        onContextMenu={ev => onClick(ev)}
        onClick={(ev) => onClick(ev)}
    >
        {tileIcon}
        <div className={"Highlight"}/>
        {isDotVisible && <div className="TileDot"/>}
    </div>
}
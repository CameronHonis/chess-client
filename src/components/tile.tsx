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
}

export interface TileFunctionalProps {
    onClick: (ev: React.MouseEvent, square: Square) => void;
}

export type TileProps = TileVisualProps & TileFunctionalProps;

export const Tile: React.FC<TileProps> = (props) => {
    const {
        square,
        pieceType,
        isSelected,
        isDotVisible,
        onClick,
    } = props;

    const isWhite = ChessPieceHelper.isWhite(pieceType)
    let tileIcon: React.JSX.Element | null = null;
    if (pieceType === ChessPiece.WHITE_PAWN || pieceType === ChessPiece.BLACK_PAWN) {
        tileIcon = <Pawn isWhite={isWhite}/>;
    } else if (pieceType === ChessPiece.WHITE_KNIGHT || pieceType === ChessPiece.BLACK_KNIGHT) {
        tileIcon = <Knight isWhite={isWhite}/>;
    } else if (pieceType === ChessPiece.WHITE_BISHOP || pieceType === ChessPiece.BLACK_BISHOP) {
        tileIcon = <Bishop isWhite={isWhite}/>;
    } else if (pieceType === ChessPiece.WHITE_ROOK || pieceType === ChessPiece.BLACK_ROOK) {
        tileIcon = <Rook isWhite={isWhite}/>;
    } else if (pieceType === ChessPiece.WHITE_QUEEN || pieceType === ChessPiece.BLACK_QUEEN) {
        tileIcon = <Queen isWhite={isWhite}/>;
    } else if (pieceType === ChessPiece.WHITE_KING || pieceType === ChessPiece.BLACK_KING) {
        tileIcon = <King isWhite={isWhite}/>;
    }

    const classNames = React.useMemo(() => {
        const classNames = [];
        classNames.push("Tile");
        classNames.push(square.isDarkSquare() ? "DarkSquare" : "LightSquare");
        if (isSelected)
            classNames.push("Selected");
        if (isDotVisible)
            classNames.push("Dotted");
        if (props.isInteractable)
            classNames.push("Interactable");
        if (props.isChecked)
            classNames.push("Checked");
        if (props.isLastMoveStart)
            classNames.push("LastMoveStart");
        if (props.isLastMoveEnd)
            classNames.push("LastMoveEnd");
        if (props.isPremove)
            classNames.push("Premove");
        return classNames;
    }, [square, isSelected, isDotVisible, props.isInteractable, props.isChecked, props.isLastMoveStart, props.isLastMoveEnd, props.isPremove]);

    return <div
        className={classNames.join(" ")}
        id={`Tile${square.hash()}`}
        onContextMenu={ev => onClick(ev, square)}
        onClick={(ev) => onClick(ev, square)}
    >
        {tileIcon}
        <div className={"Highlight"}/>
        {isDotVisible && <div className="TileDot"/>}
    </div>
}
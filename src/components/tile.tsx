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

interface Props {
    square: Square;
    pieceType: ChessPiece;
    isSelected: boolean;
    isDotVisible: boolean;
    handleSquareMouseDown: (square: Square) => void;
    handleSquareMouseUp: (square: Square) => void;
    rank: number;
    file: number;
    isInteractable: boolean;
    isChecked: boolean;
    isLastMoveStart: boolean;
    isLastMoveEnd: boolean;
}

export const Tile: React.FC<Props> = (props) => {
    const {
        square,
        pieceType,
        isSelected,
        isDotVisible,
        handleSquareMouseDown,
        handleSquareMouseUp,
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

    const highlight = React.useMemo(() => {
        if (props.isLastMoveStart) {
            return <div className={"Highlight LastMoveStart"}/>;
        } else if (props.isLastMoveEnd) {
            return <div className={"Highlight LastMoveEnd"}/>;
        }
        return null;
    }, [props.isLastMoveStart, props.isLastMoveEnd]);

    const classNames = React.useMemo(() => {
        const classNames = [];
        classNames.push("Tile");
        classNames.push(square.isDarkSquare() ? "DarkSquare" : "LightSquare");
        if (isSelected) {
            classNames.push("Selected");
        }
        if (isDotVisible) {
            classNames.push("Dotted");
        }
        if (props.isInteractable) {
            classNames.push("Interactable");
        }
        if (props.isChecked) {
            classNames.push("Checked");
        }
        if (props.isLastMoveStart) {
            classNames.push("LastMoveStart");
        }
        if (props.isLastMoveEnd) {
            classNames.push("LastMoveEnd");
        }
        return classNames;
    }, [square, isSelected, isDotVisible, props.isInteractable, props.isChecked, props.isLastMoveStart, props.isLastMoveEnd]);

    return <div
        className={classNames.join(" ")}
        id={`Tile${square.getHash()}`}
        onMouseDown={() => handleSquareMouseDown(square)}
        onMouseUp={() => handleSquareMouseUp(square)}
    >
        {tileIcon}
        {highlight}
        {isDotVisible && <div className="TileDot"/>}
    </div>
}
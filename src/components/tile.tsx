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
    isCheckingKing: boolean;
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
        if (props.isCheckingKing) {
            classNames.push("Checking");
        }
        return classNames;
    }, [square, isSelected, isDotVisible, props.isInteractable, props.isCheckingKing]);

    return <div
        className={classNames.join(" ")}
        id={`Tile${square.getHash()}`}
        onMouseDown={() => handleSquareMouseDown(square)}
        onMouseUp={() => handleSquareMouseUp(square)}
    >
        {tileIcon}
        {isDotVisible && <div className="TileDot"/>}
    </div>
}
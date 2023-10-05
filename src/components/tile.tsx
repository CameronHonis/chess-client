import React, {useEffect} from "react";
import "../styles/tile.css";
import {Pawn} from "./svgs/pawn_svg";
import {Knight} from "./svgs/knight_svg";
import {Bishop} from "./svgs/bishop_svg";
import {Rook} from "./svgs/rook_svg";
import {Queen} from "./svgs/queen_svg";
import {King} from "./svgs/king_svg";
import {ChessPiece} from "../models/enums/chess_piece";
import {ChessPieceHelper} from "../helpers/chess_piece_helper";
import {Square} from "../models/square";

interface Props {
    square: Square;
    pieceType: ChessPiece;
    isSelected: boolean;
    isDotVisible: boolean;
    handleSquareClick: (square: Square) => void;
}

export const Tile: React.FC<Props> = (props) => {
    const {square, pieceType, isSelected, isDotVisible, handleSquareClick} = props;

    useEffect(() => console.log("remount tile"), []);

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
    const className = `Tile 
        ${square.isDarkSquare() ? "DarkSquare" : "LightSquare"}
        ${isSelected ? "Selected" : ""}
        ${isDotVisible ? "Dotted" : ""}`;
    return <div className={className} onClick={() => handleSquareClick(square)}>
        {tileIcon}
        {isDotVisible && <div className="TileDot" />}
        {/*<div className="TileDot" />*/}
    </div>
}
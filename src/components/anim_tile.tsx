import React from "react";
import {ChessPiece} from "../models/enums/chess_piece";
import {Pawn} from "./pieces/pawn_svg";
import {Knight} from "./pieces/knight_svg";
import {Bishop} from "./pieces/bishop_svg";
import {Rook} from "./pieces/rook_svg";
import {Queen} from "./pieces/queen_svg";
import {King} from "./pieces/king_svg";
import {ChessPieceHelper} from "../helpers/chess_piece_helper";

export type AnimTileProps = {
    piece: ChessPiece;
    isDragging: boolean;
}

export const AnimTile: React.FC<AnimTileProps> = (props) => {
    const isWhite = ChessPieceHelper.isWhite(props.piece);
    let tileIcon: React.JSX.Element;
    if (props.piece === ChessPiece.WHITE_PAWN || props.piece === ChessPiece.BLACK_PAWN) {
        tileIcon = <Pawn isWhite={isWhite}/>;
    } else if (props.piece === ChessPiece.WHITE_KNIGHT || props.piece === ChessPiece.BLACK_KNIGHT) {
        tileIcon = <Knight isWhite={isWhite}/>;
    } else if (props.piece === ChessPiece.WHITE_BISHOP || props.piece === ChessPiece.BLACK_BISHOP) {
        tileIcon = <Bishop isWhite={isWhite}/>;
    } else if (props.piece === ChessPiece.WHITE_ROOK || props.piece === ChessPiece.BLACK_ROOK) {
        tileIcon = <Rook isWhite={isWhite}/>;
    } else if (props.piece === ChessPiece.WHITE_QUEEN || props.piece === ChessPiece.BLACK_QUEEN) {
        tileIcon = <Queen isWhite={isWhite}/>;
    } else if (props.piece === ChessPiece.WHITE_KING || props.piece === ChessPiece.BLACK_KING) {
        tileIcon = <King isWhite={isWhite}/>;
    } else {
        throw new Error("invalid piece type");
    }
    return <div className="Tile" id={props.isDragging ? "DraggingTile" : "AnimatedTile"}>
        {tileIcon}
    </div>
}
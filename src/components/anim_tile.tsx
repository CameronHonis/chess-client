import React from "react";
import {ChessPiece} from "../models/domain/chess_piece";
import {Pawn} from "./pieces/pawn";
import {Knight} from "./pieces/knight";
import {Bishop} from "./pieces/bishop";
import {Rook} from "./pieces/rook";
import {Queen} from "./pieces/queen";
import {King} from "./pieces/king";
import {ChessPieceHelper} from "../helpers/chess_piece_helper";

export type AnimTileProps = {
    piece: ChessPiece;
    id: string;
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
    return <div className="AnimTile" id={props.id}>
        {tileIcon}
    </div>
}
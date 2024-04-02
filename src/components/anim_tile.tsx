import React from "react";
import {ChessPiece} from "../models/domain/chess_piece";
import {Piece} from "./pieces/piece";

export type AnimTileProps = {
    piece: ChessPiece;
    id: string;
}

export const AnimTile: React.FC<AnimTileProps> = (props) => {
    return <div className="AnimTile" id={props.id}>
        <Piece pieceType={props.piece}/>
    </div>
}
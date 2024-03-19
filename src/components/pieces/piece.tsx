import React from "react";
import {ChessPiece} from "../../models/domain/chess_piece";
import {Pawn} from "./pawn";
import {ChessPieceHelper} from "../../helpers/chess_piece_helper";
import {Knight} from "./knight";
import {Bishop} from "./bishop";
import {Rook} from "./rook";
import {Queen} from "./queen";
import {King} from "./king";

interface Props {
    pieceType: ChessPiece;
    onDragStart?: (ev: React.DragEvent<HTMLImageElement>) => void;
    onDragEnd?: (ev: React.DragEvent<HTMLImageElement>) => void;
    classNames?: string[];
}

export const Piece: React.FC<Props> = (props) => {
    const {
        pieceType,
        onDragStart,
        onDragEnd,
        classNames,
    } = props;

    const isWhite = ChessPieceHelper.isWhite(pieceType);
    if (ChessPieceHelper.isPawn(pieceType)) {
        return <Pawn isWhite={isWhite} onDragStart={onDragStart} onDragEnd={onDragEnd} classNames={classNames}/>;
    } else if (ChessPieceHelper.isKnight(pieceType)) {
        return <Knight isWhite={isWhite} onDragStart={onDragStart} onDragEnd={onDragEnd} classNames={classNames}/>;
    } else if (ChessPieceHelper.isBishop(pieceType)) {
        return <Bishop isWhite={isWhite} onDragStart={onDragStart} onDragEnd={onDragEnd} classNames={classNames}/>;
    } else if (ChessPieceHelper.isRook(pieceType)) {
        return <Rook isWhite={isWhite} onDragStart={onDragStart} onDragEnd={onDragEnd} classNames={classNames}/>;
    } else if (ChessPieceHelper.isQueen(pieceType)) {
        return <Queen isWhite={isWhite} onDragStart={onDragStart} onDragEnd={onDragEnd} classNames={classNames}/>;
    } else if (ChessPieceHelper.isKing(pieceType)) {
        return <King isWhite={isWhite} onDragStart={onDragStart} onDragEnd={onDragEnd} classNames={classNames}/>;
    } else {
        return <></>
    }
}
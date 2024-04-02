import React from "react";
import {Material} from "../models/domain/material";
import {ChessPiece} from "../models/domain/chess_piece";
import {Piece} from "./pieces/piece";
import "../styles/board_horizontal_gutter.css";

interface Props {
    isWhitePieces: boolean;
    materialOnBoard: Material;
}

export const CapturedPieces: React.FC<Props> = (props) => {
    const {
        materialOnBoard,
        isWhitePieces: isWhite,
    } = props;

    const pieceDiff = React.useMemo(() => {
        const rtn: ChessPiece[] = [];
        const friendlyIdx = isWhite ? 1 : 0;
        const enemyIdx = isWhite ? 0 : 1;
        const pawnDiff = materialOnBoard.pawns[friendlyIdx] - materialOnBoard.pawns[enemyIdx];
        for (let i = 0; i < pawnDiff; i++)
            rtn.push(isWhite ? ChessPiece.WHITE_PAWN : ChessPiece.BLACK_PAWN);

        const knightDiff = materialOnBoard.knights[friendlyIdx] - materialOnBoard.knights[enemyIdx];
        for (let i = 0; i < knightDiff; i++)
            rtn.push(isWhite ? ChessPiece.WHITE_KNIGHT : ChessPiece.BLACK_KNIGHT);

        const enemyBishopsCount = materialOnBoard.darkSquareBishops[enemyIdx] + materialOnBoard.lightSquareBishops[enemyIdx];
        const friendlyBishopsCount = materialOnBoard.darkSquareBishops[friendlyIdx] + materialOnBoard.lightSquareBishops[friendlyIdx];
        const bishopsDiff = friendlyBishopsCount - enemyBishopsCount;
        for (let i = 0; i < bishopsDiff; i++)
            rtn.push(isWhite ? ChessPiece.WHITE_BISHOP : ChessPiece.BLACK_BISHOP);

        const rooksDiff = materialOnBoard.rooks[friendlyIdx] - materialOnBoard.rooks[enemyIdx];
        for (let i = 0; i < rooksDiff; i++)
            rtn.push(isWhite ? ChessPiece.WHITE_ROOK : ChessPiece.BLACK_ROOK);

        const queensDiff = materialOnBoard.queens[friendlyIdx] - materialOnBoard.queens[enemyIdx];
        for (let i = 0; i < queensDiff; i++)
            rtn.push(isWhite ? ChessPiece.WHITE_QUEEN : ChessPiece.BLACK_QUEEN);
        return rtn;
    }, [materialOnBoard, isWhite]);

    const className = React.useMemo(() => {
        const classNames = ["CapturedPieces"];
        if (isWhite) {
            classNames.push("White");
        } else {
            classNames.push("Black");
        }
        return classNames.join(" ");
    }, [isWhite]);

    return <div className={className}>
        {pieceDiff.map((piece, idx) => <Piece pieceType={piece} classNames={["CapturedPiece"]} key={idx}/>)}
    </div>
}
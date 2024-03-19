import React from "react";
import {Material} from "../models/domain/material";
import {ChessPiece} from "../models/domain/chess_piece";
import {Piece} from "./pieces/piece";
import "../styles/board_horizontal_gutter.css";

interface Props {
    isWhitePerspective: boolean;
    isWhite: boolean;
    displayName: string;
    materialOnBoard: Material;
}

export const BoardHorizontalGutter: React.FC<Props> = (props) => {
    const {
        isWhitePerspective,
        isWhite,
        displayName,
        materialOnBoard,
    } = props;

    const isBottom = React.useMemo(() => {
        return isWhite === isWhitePerspective;
    }, [isWhite, isWhitePerspective]);

    const pieceDiff = React.useMemo(() => {
        const rtn: ChessPiece[] = [];
        const friendlyIdx = isWhite ? 0 : 1;
        const enemyIdx = isWhite ? 1 : 0;
        const pawnDiff = materialOnBoard.pawns[friendlyIdx] - materialOnBoard.pawns[enemyIdx];
        for (let i = 0; i < pawnDiff; i++)
            rtn.push(isWhite ? ChessPiece.BLACK_PAWN : ChessPiece.WHITE_PAWN);

        const knightDiff = materialOnBoard.knights[friendlyIdx] - materialOnBoard.knights[enemyIdx];
        for (let i = 0; i < knightDiff; i++)
            rtn.push(isWhite ? ChessPiece.BLACK_KNIGHT : ChessPiece.WHITE_KNIGHT);

        const enemyBishopsCount = materialOnBoard.darkSquareBishops[enemyIdx] + materialOnBoard.lightSquareBishops[enemyIdx];
        const friendlyBishopsCount = materialOnBoard.darkSquareBishops[friendlyIdx] + materialOnBoard.lightSquareBishops[friendlyIdx];
        const bishopsDiff = friendlyBishopsCount - enemyBishopsCount;
        for (let i = 0; i < bishopsDiff; i++)
            rtn.push(isWhite ? ChessPiece.BLACK_BISHOP : ChessPiece.WHITE_BISHOP);

        const rooksDiff = materialOnBoard.rooks[friendlyIdx] - materialOnBoard.rooks[enemyIdx];
        for (let i = 0; i < rooksDiff; i++)
            rtn.push(isWhite ? ChessPiece.BLACK_ROOK : ChessPiece.WHITE_ROOK);

        const queensDiff = materialOnBoard.queens[friendlyIdx] - materialOnBoard.queens[enemyIdx];
        for (let i = 0; i < queensDiff; i++)
            rtn.push(isWhite ? ChessPiece.BLACK_QUEEN : ChessPiece.WHITE_QUEEN);
        return rtn;
    }, [materialOnBoard, isWhite]);


    return <div className={isBottom ? "BoardBottomGutter" : "BoardTopGutter"}>
        <p className={"PlayerName"}>{displayName}</p>
        <div className={"LostPieces"}>
            {pieceDiff.map(piece => <Piece pieceType={piece} classNames={["LostPiece"]}/>)}
        </div>
    </div>
}
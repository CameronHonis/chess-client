import React from "react";
import {ChessPiece} from "../../models/domain/chess_piece";
import {ChessPieceHelper} from "../../helpers/chess_piece_helper";

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
        classNames: priorClassNames,
    } = props;


    const isWhite = ChessPieceHelper.isWhite(pieceType);
    const [imgSrc, imgAlt, imgClassName] = React.useMemo(() => {
        const classNames = [...(priorClassNames || []), "Piece"];
        if (isWhite) {
            classNames.push("White");
        } else {
            classNames.push("Black");
        }
        if (ChessPieceHelper.isPawn(pieceType)) {
            classNames.push("Pawn");
            if (isWhite) {
                classNames.push("WhitePawn");
                return ["https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg", classNames.join(" ")];
            } else {
                classNames.push("BlackPawn");
                return ["https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg", "black pawn", classNames.join(" ")];
            }
        } else if (ChessPieceHelper.isKnight(pieceType)) {
            classNames.push("Knight");
            if (isWhite) {
                classNames.push("WhiteKnight");
                return ["https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg", "white knight", classNames.join(" ")];
            } else {
                classNames.push("BlackKnight");
                return ["https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg", "black knight", classNames.join(" ")];
            }
        } else if (ChessPieceHelper.isBishop(pieceType)) {
            classNames.push("Bishop");
            if (isWhite) {
                classNames.push("WhiteBishop");
                return ["https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg", "white bishop", classNames.join(" ")];
            } else {
                classNames.push("BlackBishop");
                return ["https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg", "black bishop", classNames.join(" ")];
            }
        } else if (ChessPieceHelper.isRook(pieceType)) {
            classNames.push("Rook");
            if (isWhite) {
                classNames.push("WhiteRook");
                return ["https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg", "white rook", classNames.join(" ")];
            } else {
                classNames.push("BlackRook");
                return ["https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg", "black rook", classNames.join(" ")];
            }
        } else if (ChessPieceHelper.isQueen(pieceType)) {
            classNames.push("Queen");
            if (isWhite) {
                classNames.push("WhiteQueen");
                return ["https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg", "white queen", classNames.join(" ")];
            } else {
                classNames.push("BlackQueen");
                return ["https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg", "black queen", classNames.join(" ")];
            }
        } else if (ChessPieceHelper.isKing(pieceType)) {
            classNames.push("King");
            if (isWhite) {
                classNames.push("WhiteKing");
                return ["https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg", "white king", classNames.join(" ")];
            } else {
                classNames.push("BlackKing");
                return ["https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg", "black king", classNames.join(" ")];
            }
        }
        return ["", "", classNames.join(" ")];
    }, [priorClassNames, isWhite, pieceType]);

    if (pieceType === ChessPiece.EMPTY) {
        return null;
    }

    return <img
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className={imgClassName}
        src={imgSrc}
        alt={imgAlt}
    />;
}
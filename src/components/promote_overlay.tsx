import React from "react";
import {Move} from "../models/domain/move";
import {ChessPiece} from "../models/domain/chess_piece";

import "../styles/promote_overlay.css";
import {Piece} from "./pieces/piece";

export interface PromoteOverlayProps {
    isWhite: boolean;
    move: Move;
    onPromote: (piece: ChessPiece) => void;
    onCancel: () => void;
}

export const PromoteOverlay = (props: PromoteOverlayProps) => {
    const {isWhite, move, onPromote, onCancel} = props;

    const promote = (ev: React.MouseEvent, piece: ChessPiece) => {
        ev.stopPropagation();
        onPromote(piece);
    };

    const containerStyles = React.useMemo(() => {
        const tileId = `Tile${move.endSquare.rank}-${move.endSquare.file}`;
        const tile = document.getElementById(tileId);
        if (!tile)
            throw new Error("could not find tile for promote overlay placement");
        const rect = tile.getBoundingClientRect();
        return {
            top: `${rect.top}px`,
            left: `${rect.left}px`,
        };
    }, [move]);

    return (
        <div className="PromoteOverlay">
            <div className="PromoteOverlay-Pieces" style={containerStyles}>
                <div>
                    <button className="PromoteOverlay-Piece"
                            onClick={ev => promote(ev, isWhite ? ChessPiece.WHITE_QUEEN : ChessPiece.BLACK_QUEEN)}
                    >
                        <Piece pieceType={isWhite ? ChessPiece.WHITE_QUEEN : ChessPiece.BLACK_QUEEN}/>
                    </button>
                    <button className="PromoteOverlay-Piece"
                            onClick={ev => promote(ev, isWhite ? ChessPiece.WHITE_ROOK : ChessPiece.BLACK_ROOK)}
                    >
                        <Piece pieceType={isWhite ? ChessPiece.WHITE_ROOK : ChessPiece.BLACK_ROOK}/>
                    </button>
                </div>
                <div>
                    <button className="PromoteOverlay-Piece"
                            onClick={ev => promote(ev, isWhite ? ChessPiece.WHITE_BISHOP : ChessPiece.BLACK_BISHOP)}
                    >
                        <Piece pieceType={isWhite ? ChessPiece.WHITE_BISHOP : ChessPiece.BLACK_BISHOP}/>
                    </button>
                    <button className="PromoteOverlay-Piece"
                            onClick={ev => promote(ev, isWhite ? ChessPiece.WHITE_KNIGHT : ChessPiece.BLACK_KNIGHT)}
                    >
                        <Piece pieceType={isWhite ? ChessPiece.WHITE_KNIGHT : ChessPiece.BLACK_KNIGHT}/>
                    </button>
                </div>
            </div>
            <div className="PromoteOverlay-Cancel" onClick={onCancel}/>
        </div>
    );
}
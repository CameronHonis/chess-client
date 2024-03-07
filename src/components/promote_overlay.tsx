import React from "react";
import {Move} from "../models/domain/move";
import {ChessPiece} from "../models/domain/chess_piece";
import {Queen} from "./pieces/queen_svg";
import {Rook} from "./pieces/rook_svg";
import {Bishop} from "./pieces/bishop_svg";
import {Knight} from "./pieces/knight_svg";

import "../styles/promote_overlay.css";

export interface PromoteOverlayProps {
    isWhite: boolean;
    move: Move;
    onPromote: (move: Move) => void;
    onCancel: () => void;
}

export const PromoteOverlay = (props: PromoteOverlayProps) => {
    const {isWhite, move, onPromote, onCancel} = props;

    const promote = (ev: React.MouseEvent, piece: ChessPiece) => {
        ev.stopPropagation();
        move.pawnUpgradedTo = piece;
        onPromote(move);
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
                        <Queen isWhite={isWhite}/>
                    </button>
                    <button className="PromoteOverlay-Piece"
                            onClick={ev => promote(ev, isWhite ? ChessPiece.WHITE_ROOK : ChessPiece.BLACK_ROOK)}
                    >
                        <Rook isWhite={isWhite}/>
                    </button>
                </div>
                <div>
                    <button className="PromoteOverlay-Piece"
                            onClick={ev => promote(ev, isWhite ? ChessPiece.WHITE_BISHOP : ChessPiece.BLACK_BISHOP)}
                    >
                        <Bishop isWhite={isWhite}/>
                    </button>
                    <button className="PromoteOverlay-Piece"
                            onClick={ev => promote(ev, isWhite ? ChessPiece.WHITE_KNIGHT : ChessPiece.BLACK_KNIGHT)}
                    >
                        <Knight isWhite={isWhite}/>
                    </button>
                </div>
            </div>
            <div className="PromoteOverlay-Cancel" onClick={onCancel}/>
        </div>
    );
}
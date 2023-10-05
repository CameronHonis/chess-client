import React, {useEffect, useMemo, useRef, useState} from "react";
import "../styles/board.css";
import {Tile} from "./tile";
import {BoardState} from "../models/board_state";
import {Square} from "../models/square";
import {ChessPieceHelper} from "../helpers/chess_piece_helper";

const handleWindowResize = (boardElement: HTMLDivElement) => {
    const borderSizePx = 5;
    const margin = 25;
    const maxBoardLen = Math.min(window.innerWidth, window.innerHeight) - borderSizePx * 2 - margin * 2;
    boardElement.style.width = `${maxBoardLen.toString()}px`;
    boardElement.style.border = `${borderSizePx.toString()}px solid #ddd`
}


export const Board: React.FC = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const [boardState, setBoardState] = useState<BoardState>(BoardState.getInitBoardState());
    const [squareSelected, setSquareSelected] = useState<Square | null>(new Square(2, 4));

    // runs only once when component is created
    useEffect(() => {
        if (boardRef.current == null) return;
        handleWindowResize(boardRef.current);
        window.addEventListener("resize", () => handleWindowResize(boardRef.current as HTMLDivElement));
    }, [boardRef]);

    const [targetSquareHashes, movesByStartSquareHash] = useMemo(() => {
        const _movesByStartSquareHash = boardState.getLegalMovesGroupedBySquareHash();
        if (squareSelected && squareSelected.getHash() in _movesByStartSquareHash) {
            const moves = _movesByStartSquareHash[squareSelected.getHash()];
            return [new Set(moves.map(move => move.endSquare.getHash())), _movesByStartSquareHash];
        } else {
            return [new Set(), _movesByStartSquareHash];
        }
    }, [squareSelected, boardState]);

    const handleTileMouseClick = (square: Square) => {
        if (squareSelected && !targetSquareHashes.has(square.getHash())) {
            setSquareSelected(null);
            return;
        }
        // we know at this point, the square clicked is not selected
        const piece = boardState.getPieceBySquare(square);
        if (ChessPieceHelper.isWhite(piece)) {
            setSquareSelected(square);
            return;
        }

    }

    const tiles: React.ReactElement[] = []
    for (let rank = 8; rank > 0; rank--) {
        for (let file = 1; file < 9; file++) {
            const square = new Square(rank, file);
            const idx = (rank - 1) * 8 + (file - 1);
            const isSelected = !!(squareSelected) &&
                squareSelected.rank === rank &&
                squareSelected.file === file;
            tiles.push(<Tile square={square} pieceType={boardState.getPieceBySquare(square)}
                             isSelected={isSelected}
                             isDotVisible={targetSquareHashes.has(square.getHash())}
                             handleSquareClick={handleTileMouseClick}
                             key={idx}/>);
        }
    }
    return <div className="Board" ref={boardRef}>
        {tiles}
    </div>
}
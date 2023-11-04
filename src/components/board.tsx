import React, {useEffect, useMemo, useRef, useState} from "react";
import "../styles/board.css";
import {Tile} from "./tile";
import {Square} from "../models/square";
import {ChessPieceHelper} from "../helpers/chess_piece_helper";
import {Match} from "../models/match";
import {ChessPiece} from "../models/enums/chess_piece";
import {Move} from "../models/move";
import {matchContext} from "../App";

const handleWindowResize = (boardElement: HTMLDivElement) => {
    const borderSizePx = 5;
    const margin = 25;
    const maxBoardLen = Math.min(window.innerWidth, window.innerHeight) - borderSizePx * 2 - margin * 2;
    boardElement.style.width = `${maxBoardLen.toString()}px`;
    boardElement.style.border = `${borderSizePx.toString()}px solid #ddd`
}

export interface BoardProps {
}

export const Board: React.FC<BoardProps> = (props) => {
    const match = React.useContext(matchContext);
    const boardRef = useRef<HTMLDivElement>(null);
    const [squareSelected, setSquareSelected] = useState<Square | null>(null);

    // runs only once when component is created
    useEffect(() => {
        if (boardRef.current == null) return;
        handleWindowResize(boardRef.current);
        window.addEventListener("resize", () => handleWindowResize(boardRef.current as HTMLDivElement));
    }, [boardRef]);

    const [targetSquareHashes, movesByStartSquareHash] = useMemo(() => {
        if (!match) {
            return [new Set(), {}]
        }
        const _movesByStartSquareHash = match.board.getLegalMovesGroupedBySquareHash();
        if (squareSelected && squareSelected.getHash() in _movesByStartSquareHash) {
            const moves = _movesByStartSquareHash[squareSelected.getHash()];
            return [new Set(moves.map(move => move.endSquare.getHash())), _movesByStartSquareHash];
        } else {
            return [new Set(), _movesByStartSquareHash];
        }
    }, [squareSelected, match]);

    const handleTileMouseClick = (clickedSquare: Square) => {
        if (!match) {
            return false;
        }
        const clickedPiece = match.board.getPieceBySquare(clickedSquare);
        if (squareSelected) {
            if (squareSelected.equalTo(clickedSquare)) {
                setSquareSelected(null);
                return;
            } else if (targetSquareHashes.has(clickedSquare.getHash())) {
                let move: Move | undefined = undefined;
                for (let possibleMove of movesByStartSquareHash[squareSelected.getHash()]) {
                    if (possibleMove.endSquare.equalTo(clickedSquare)) {
                        move = possibleMove;
                        break;
                    }
                }
                if (!move) {
                    throw new Error("target squares not consistent with movesByStartSquareHash");
                }
                window.services.arbitratorClient.sendMove(match.uuid, move);
                setSquareSelected(null);
            }
        }
        const isSelectedOwnPiece = (ChessPieceHelper.isWhite(clickedPiece) && isWhitePerspective)
            || (!ChessPieceHelper.isWhite(clickedPiece) && !isWhitePerspective);
        if (isSelectedOwnPiece) {
            setSquareSelected(clickedSquare);
            return;
        }

    }

    const isWhitePerspective = window.services.authManager.getArbitratorKeyset()?.publicKey === match?.whiteClientId;
    const tiles: React.ReactElement[] = []
    if (isWhitePerspective) {
        for (let rank = 8; rank > 0; rank--) {
            for (let file = 1; file < 9; file++) {
                const square = new Square(rank, file);
                const idx = (rank - 1) * 8 + (file - 1);
                const isSelected = !!squareSelected &&
                    squareSelected.rank === rank &&
                    squareSelected.file === file;
                tiles.push(<Tile square={square}
                                 pieceType={match ? match.board.getPieceBySquare(square) : ChessPiece.EMPTY}
                                 isSelected={isSelected}
                                 isDotVisible={targetSquareHashes.has(square.getHash())}
                                 handleSquareClick={handleTileMouseClick}
                                 key={idx}/>);
            }
        }

    } else {
        for (let rank = 1; rank < 9; rank++) {
            for (let file = 1; file < 9; file++) {
                const square = new Square(rank, file);
                const idx = (rank - 1) * 8 + (file - 1);
                const isSelected = !!squareSelected &&
                    squareSelected.rank === rank &&
                    squareSelected.file === file;
                tiles.push(<Tile square={square}
                                 pieceType={match ? match.board.getPieceBySquare(square) : ChessPiece.EMPTY}
                                 isSelected={isSelected}
                                 isDotVisible={targetSquareHashes.has(square.getHash())}
                                 handleSquareClick={handleTileMouseClick}
                                 key={idx}/>);
            }
        }
    }
    return <div className={"BoardFrame"}>
        <div className={"Board"} ref={boardRef}>
            {tiles}
        </div>
    </div>
}
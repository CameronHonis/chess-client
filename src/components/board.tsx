import React, {useEffect, useMemo, useRef, useState} from "react";
import "../styles/board.css";
import {Tile} from "./tile";
import {Square} from "../models/square";
import {ChessPieceHelper} from "../helpers/chess_piece_helper";
import {ChessPiece} from "../models/enums/chess_piece";
import {Move} from "../models/move";
import {matchContext} from "../App";
import {ReactComp, Throwable} from "../types";
import {Timer} from "./timer";
import {Match} from "../models/match";

const handleWindowResize = (boardElement: HTMLDivElement, headerElement: HTMLDivElement) => {
    const verticalMargin = 50;
    const horizontalMargin = 10;
    const maxHeight = window.innerHeight - headerElement.offsetHeight - 2 * verticalMargin;
    const maxWidth = window.innerWidth - 2 * horizontalMargin;
    // const margin = Number.parseInt(containerRef.current.style.margin.slice(0, -2));
    const boardLen = Math.min(maxHeight, maxWidth);
    boardElement.style.width = `${boardLen}px`;
    boardElement.style.height = `${boardLen}px`;
    boardElement.style.margin = `${verticalMargin}px ${horizontalMargin}px`;
}

export interface BoardProps {
    header: HTMLDivElement | null;
}

export const Board: React.FC<BoardProps> = (props) => {
    const match = React.useContext(matchContext) as Match;
    const boardRef = useRef<HTMLDivElement>(null);
    const [squareSelected, setSquareSelected] = useState<Square | null>(null);

    // runs only once when component is created
    useEffect(() => {
        if (boardRef.current == null) return;
        if (props.header == null) return;
        handleWindowResize(boardRef.current, props.header);
        // @ts-ignore
        window.addEventListener("resize", () => handleWindowResize(boardRef.current, props.header));
    }, [props.header, boardRef]);

    const [targetSquareHashes, movesByStartSquareHash] = useMemo(() => {
        const _movesByStartSquareHash = match.board.getLegalMovesGroupedBySquareHash();
        if (squareSelected && squareSelected.getHash() in _movesByStartSquareHash) {
            const moves = _movesByStartSquareHash[squareSelected.getHash()];
            return [new Set(moves.map(move => move.endSquare.getHash())), _movesByStartSquareHash];
        } else {
            return [new Set(), _movesByStartSquareHash];
        }
    }, [squareSelected, match]);

    const whiteId = match.whiteClientId;
    const isWhitePerspective = React.useMemo((): Throwable<boolean> => {
        const arbitratorKeyset = window.services.authManager.getArbitratorKeyset();
        if (!arbitratorKeyset) {
            throw new Error("couldn't get isWhitePerspective: arbitrator keyset is not defined");
        }
        return arbitratorKeyset.publicKey === whiteId;
    }, [whiteId]);

    const handleTileMouseClick = React.useCallback((clickedSquare: Square) => {
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
    }, [isWhitePerspective, match, movesByStartSquareHash, squareSelected, targetSquareHashes]);

    const getTiles = React.useCallback((): ReactComp<typeof Tile>[] => {
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
                for (let file = 8; file > 0; file--) {
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
        return tiles;
    }, [isWhitePerspective, handleTileMouseClick, match, squareSelected, targetSquareHashes]);

    const getPlayerSeconds = React.useCallback((isOpponent: boolean): number => {
        if (isWhitePerspective) {
            if (isOpponent) {
                return match.blackTimeRemaining;
            } else {
                return match.whiteTimeRemaining;
            }
        } else {
            if (isOpponent) {
                return match.whiteTimeRemaining;
            } else {
                return match.blackTimeRemaining;
            }
        }
    }, [isWhitePerspective, match]);

    return <div className={"BoardFrame"}>
        {/*<Timer isWhite={!isWhitePerspective} seconds={getPlayerSeconds(true)}/>*/}
        <div className={"Board"} ref={boardRef}>
            {getTiles()}
        </div>
        {/*<Timer isWhite={isWhitePerspective} seconds={getPlayerSeconds(false)}/>*/}
    </div>
}
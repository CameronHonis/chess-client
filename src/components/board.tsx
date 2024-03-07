import React, {useMemo, useState} from "react";
import "../styles/board.css";
import {Tile} from "./tile";
import {Square} from "../models/domain/square";
import {ChessPieceHelper} from "../helpers/chess_piece_helper";
import {ChessPiece} from "../models/domain/chess_piece";
import {Move} from "../models/domain/move";
import {appStateContext} from "../App";
import {ReactComp, Throwable} from "../types";
import {Summary} from "./summary";
import {AnimTile} from "./anim_tile";
import {BoardLeftGutter} from "./board_left_gutter";
import {MatchResult} from "../models/domain/match_result";
import {formatKey} from "../helpers/format_key";
import {GameHelper} from "../helpers/game_helper";
import {PromoteOverlay} from "./promote_overlay";

export interface BoardProps {
}

export const Board: React.FC<BoardProps> = () => {
    const [appState] = React.useContext(appStateContext);
    const [squareSelected, setSquareSelected] = useState<Square | null>(null);
    const [draggingSquare, setDraggingSquare] = useState<Square | null>(null);
    const [promoteMove, setPromoteMove] = useState<Move | null>(null);
    const match = appState.match!;

    React.useEffect(() => {
        window.services.timer.setFromMatch(match);
    }, [match]);

    React.useEffect(() => {
        if (!draggingSquare) {
            window.services.boardAnimator.dropPiece();
            return;
        }
        window.services.boardAnimator.holdPiece(draggingSquare);
    }, [draggingSquare]);

    const [isWhiteKingChecked, isBlackKingChecked] = useMemo(() => {
        const whiteKingCheckingSquares = GameHelper.getPieceSquaresCheckingKing(match.board, true);
        const blackKingCheckingSquares = GameHelper.getPieceSquaresCheckingKing(match.board, false);
        return [whiteKingCheckingSquares.length > 0, blackKingCheckingSquares.length > 0];
    }, [match.board]);

    const movesByStartSquareHash = useMemo(() => {
        if (squareSelected != null) {
            console.log("squareSelected", squareSelected.getHash());
        }
        return match.board.getLegalMovesGroupedBySquareHash();
    }, [squareSelected, match]);

    const getLandSquareHashes = React.useCallback((originSquare: Square): Set<string> => {
        const originSquareHash = originSquare.getHash();
        if (!(originSquareHash in movesByStartSquareHash)) {
            return new Set();
        }
        const moves = movesByStartSquareHash[originSquare.getHash()];
        return new Set(moves.map(move => move.endSquare.getHash()));
    }, [movesByStartSquareHash]);

    const getIsInteractable = React.useCallback((square: Square): boolean => {
        if (!match) {
            return false;
        }
        if (squareSelected) {
            if (square.equalTo(squareSelected)) {
                return true;
            }
            const landSquareHashes = getLandSquareHashes(squareSelected);
            if (landSquareHashes.has(square.getHash())) {
                return true;
            }
        }
        const pieceType = match.board.getPieceBySquare(square);
        const isPieceTurn =
            (ChessPieceHelper.isWhite(pieceType) && match.board.isWhiteTurn) ||
            (ChessPieceHelper.isBlack(pieceType) && !match.board.isWhiteTurn);
        return isPieceTurn;
    }, [getLandSquareHashes, match, squareSelected]);

    const whiteId = match.whiteClientKey;
    const isWhitePerspective = React.useMemo((): Throwable<boolean> => {
        if (!appState.auth) {
            throw new Error("couldn't get isWhitePerspective: arbitrator keyset is not defined");
        }
        return appState.auth.publicKey === whiteId;
    }, [appState.auth, whiteId]);

    const handleTileMouseDown = React.useCallback((mouseSquare: Square) => {
        if (squareSelected && mouseSquare.equalTo(squareSelected)) {
            return;
        }
        const mousePiece = match.board.getPieceBySquare(mouseSquare);
        if (mousePiece === ChessPiece.EMPTY) {
            return;
        }
        const isWhitePiece = ChessPieceHelper.isWhite(mousePiece);
        const isWhiteTurn = match.board.isWhiteTurn;
        if (isWhitePiece !== isWhiteTurn) {
            return;
        }
        setSquareSelected(mouseSquare);
        setDraggingSquare(mouseSquare);
    }, [squareSelected, match.board]);

    const handleTileMouseUp = React.useCallback((dropSquare: Square) => {
        if (!squareSelected) {
            return;
        }

        if (dropSquare.equalTo(squareSelected)) {
            if (draggingSquare) {
                setDraggingSquare(null);
            } else {
                setSquareSelected(null);
            }
            return;
        }

        const landSquareHashes = getLandSquareHashes(squareSelected);
        const dropSquareHash = dropSquare.getHash();
        const isLegalMove = landSquareHashes.has(dropSquareHash);
        if (!isLegalMove) {
            setDraggingSquare(null);
            setSquareSelected(null);
            return;
        }

        const move = movesByStartSquareHash[squareSelected.getHash()].find(m => {
            return m.endSquare.equalTo(dropSquare);
        });

        if (!move)
            throw new Error(`couldn't find move with end square ${dropSquare.getHash()}`);

        const isPromotion = (move.endSquare.rank === 1 || move.endSquare.rank === 8)
            && ChessPieceHelper.isPawn(move.piece);
        if (isPromotion) {
            setPromoteMove(move);
        } else {
            sendMove(move);
        }
    }, [appState.auth, squareSelected, draggingSquare, match.uuid, getLandSquareHashes, movesByStartSquareHash]);

    const sendMove = React.useCallback((move: Move) => {
        window.services.arbitratorClient.sendMove(match.uuid, move, appState.auth!);
        setDraggingSquare(null);
        setSquareSelected(null);
        setPromoteMove(null);
    }, [appState.auth, match.uuid]);

    const tiles = React.useMemo((): ReactComp<typeof Tile>[] => {
        const tiles: React.ReactElement[] = []
        const landSquareHashes = squareSelected ? getLandSquareHashes(squareSelected) : new Set<string>();
        const lastMove = appState.lastMove;
        for (let r = 7; r >= 0; r--) {
            for (let c = 0; c < 8; c++) {
                let rank: number, file: number;
                if (isWhitePerspective) {
                    rank = r + 1;
                    file = c + 1;
                } else {
                    rank = 8 - r;
                    file = 8 - c;
                }
                const square = new Square(rank, file);
                const idx = 8 * r + c;
                const isSelected = !!squareSelected && square.equalTo(squareSelected);
                const isDotVisible = landSquareHashes.has(square.getHash())
                const pieceType = match.board.getPieceBySquare(square);
                const isChecked = (pieceType === ChessPiece.WHITE_KING && isWhiteKingChecked) ||
                    (pieceType === ChessPiece.BLACK_KING && isBlackKingChecked)
                const isLastMoveStart = !!lastMove && lastMove.startSquare.equalTo(square);
                const isLastMoveEnd = !!lastMove && lastMove.endSquare.equalTo(square);
                tiles.push(<Tile square={square}
                                 pieceType={pieceType}
                                 isSelected={isSelected}
                                 isDotVisible={isDotVisible}
                                 handleSquareMouseDown={handleTileMouseDown}
                                 handleSquareMouseUp={handleTileMouseUp}
                                 rank={r}
                                 file={c}
                                 isInteractable={getIsInteractable(square)}
                                 isChecked={isChecked}
                                 isLastMoveStart={isLastMoveStart}
                                 isLastMoveEnd={isLastMoveEnd}
                                 key={idx}/>);
            }
        }
        return tiles;
    }, [squareSelected, getLandSquareHashes, appState.lastMove, isWhitePerspective, match.board, isWhiteKingChecked, isBlackKingChecked, handleTileMouseDown, handleTileMouseUp, getIsInteractable]);

    const animTile = React.useMemo((): ReactComp<typeof AnimTile> | null => {
        if (!appState.lastMove) {
            return null;
        }
        return <AnimTile piece={appState.lastMove.piece} isDragging={false}/>;
    }, [appState.lastMove]);

    const draggingTile = React.useMemo((): ReactComp<typeof Tile> | null => {
        if (draggingSquare === null) {
            return null;
        }
        return <AnimTile piece={match.board.getPieceBySquare(draggingSquare)} isDragging/>;
    }, [match.board, draggingSquare]);

    const [selfClientKey, oppClientKey] = React.useMemo(() => {
        if (isWhitePerspective) {
            return [match.whiteClientKey, match.blackClientKey];
        } else {
            return [match.blackClientKey, match.whiteClientKey];
        }
    }, [isWhitePerspective, match.whiteClientKey, match.blackClientKey]);


    return <div className={"BoardFrame"}>
        <BoardLeftGutter isWhitePerspective={isWhitePerspective}/>
        <div className={"BoardWrapped"}>
            <p className={"NameTag OppNameTag"}>{formatKey(oppClientKey)}</p>
            <div className={"Board"}>
                {tiles}
                {animTile}
                {draggingTile}
            </div>
            <p className={"NameTag SelfNameTag"}>{formatKey(selfClientKey)}</p>
        </div>
        {promoteMove && <PromoteOverlay isWhite={isWhitePerspective} move={promoteMove} onPromote={sendMove}
                                        onCancel={() => setPromoteMove(null)}/>}
        {match.result !== MatchResult.IN_PROGRESS && <Summary/>}
    </div>
}
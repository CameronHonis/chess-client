import {Move} from "../models/domain/move";
import {Board} from "../models/domain/board";
import {Square} from "../models/domain/square";
import {ChessPiece} from "../models/domain/chess_piece";
import {ChessPieceHelper} from "./chess_piece_helper";
import {Material} from "../models/domain/material";

export class GameHelper {
    static getLegalMovesByBoardAndStartSquare(board: Board, square: Square): Move[] {
        const piece = board.getPieceBySquare(square);
        if (piece === ChessPiece.EMPTY) {
            return [];
        }
        if (board.isWhiteTurn !== ChessPieceHelper.isWhite(piece)) {
            return [];
        }

        if (ChessPieceHelper.isPawn(piece)) {
            return GameHelper.getLegalMovesForPawn(board, square);
        } else if (ChessPieceHelper.isKnight(piece)) {
            return GameHelper.getLegalMovesForKnight(board, square);
        } else if (ChessPieceHelper.isBishop(piece)) {
            return GameHelper.getLegalMovesForBishop(board, square);
        } else if (ChessPieceHelper.isRook(piece)) {
            return GameHelper.getLegalMovesForRook(board, square);
        } else if (ChessPieceHelper.isQueen(piece)) {
            return GameHelper.getLegalMovesForQueen(board, square);
        } else if (ChessPieceHelper.isKing(piece)) {
            return GameHelper.getLegalMovesForKing(board, square);
        }
        throw new Error(`Unhandled piece type: ${piece}`);
    }

    static getPossibleLandSquaresForSquare(boardState: Board, square: Square): Square[] {
        const piece = boardState.getPieceBySquare(square);
        if (piece === ChessPiece.EMPTY)
            return [];
        if (ChessPieceHelper.isPawn(piece)) {
            return getPossibleLandSquaresForPawn(ChessPieceHelper.isWhite(piece), square);
        } else if (ChessPieceHelper.isKnight(piece)) {
            return getPossibleLandSquaresForKnight(square);
        } else if (ChessPieceHelper.isBishop(piece)) {
            return getPossibleLandSquaresForBishop(square);
        } else if (ChessPieceHelper.isRook(piece)) {
            return getPossibleLandSquaresForRook(square);
        } else if (ChessPieceHelper.isQueen(piece)) {
            return getPossibleLandSquaresForQueen(square);
        } else {
            let canKingsideCastle = false;
            let canQueensideCastle = false;
            if (boardState.isWhiteTurn) {
                canKingsideCastle = boardState.canWhiteCastleKingside;
                canQueensideCastle = boardState.canWhiteCastleQueenside;
            } else {
                canKingsideCastle = boardState.canBlackCastleKingside;
                canQueensideCastle = boardState.canBlackCastleQueenside;
            }
            return getPossibleLandSquaresForKing(
                canKingsideCastle,
                canQueensideCastle,
                square
            );
        }
    }

    static getLegalMovesForPawn(boardState: Board, square: Square): Move[] {
        let moves: Move[] = [];
        const piece = boardState.getPieceBySquare(square);
        const upgradePieces = boardState.isWhiteTurn ?
            [ChessPiece.WHITE_KNIGHT, ChessPiece.WHITE_BISHOP, ChessPiece.WHITE_ROOK, ChessPiece.WHITE_QUEEN] :
            [ChessPiece.BLACK_KNIGHT, ChessPiece.BLACK_BISHOP, ChessPiece.BLACK_ROOK, ChessPiece.BLACK_QUEEN];
        const rankDir = boardState.isWhiteTurn ? 1 : -1;
        const squareInFront = new Square(square.rank + rankDir, square.file);
        const pieceInFront = boardState.getPieceBySquare(squareInFront);
        if (pieceInFront === ChessPiece.EMPTY) {
            if (squareInFront.rank === 8 || squareInFront.rank === 1) {
                for (let upgradePiece of upgradePieces) {
                    moves.push(new Move(piece, square, squareInFront, [], ChessPiece.EMPTY, upgradePiece));
                }
            } else {
                moves.push(new Move(piece, square, squareInFront, [], ChessPiece.EMPTY, ChessPiece.EMPTY));
            }
            if ((boardState.isWhiteTurn && square.rank === 2) || (!boardState.isWhiteTurn && square.rank === 7)) {
                const squareTwoInFront = new Square(square.rank + 2 * rankDir, square.file);
                const pieceTwoInFront = boardState.getPieceBySquare(squareTwoInFront);
                if (pieceTwoInFront === ChessPiece.EMPTY) {
                    moves.push(new Move(piece, square, squareTwoInFront, [], ChessPiece.EMPTY, ChessPiece.EMPTY));
                }
            }
        }
        const leftCaptureSquare = new Square(square.rank + rankDir, square.file - 1);
        if (GameHelper.isCapturableSquare(boardState, leftCaptureSquare, true)) {
            let capturePiece = boardState.getPieceBySquare(leftCaptureSquare);
            if (leftCaptureSquare.rank === 8 || leftCaptureSquare.rank === 1) {
                for (let upgradePiece of upgradePieces) {
                    moves.push(new Move(piece, square, leftCaptureSquare, [], capturePiece, upgradePiece));
                }
            } else {
                if (capturePiece === ChessPiece.EMPTY) {
                    if (boardState.isWhiteTurn) {
                        capturePiece = ChessPiece.BLACK_PAWN;
                    } else {
                        capturePiece = ChessPiece.WHITE_PAWN;
                    }
                }
                moves.push(new Move(piece, square, leftCaptureSquare, [], capturePiece, ChessPiece.EMPTY));
            }
        }
        const rightCaptureSquare = new Square(square.rank + rankDir, square.file + 1);
        if (GameHelper.isCapturableSquare(boardState, rightCaptureSquare, true)) {
            let capturePiece = boardState.getPieceBySquare(rightCaptureSquare);
            if (rightCaptureSquare.rank === 8 || rightCaptureSquare.rank === 1) {
                for (let upgradePiece of upgradePieces) {
                    moves.push(new Move(piece, square, rightCaptureSquare, [], capturePiece, upgradePiece));
                }
            } else {
                if (capturePiece === ChessPiece.EMPTY) {
                    if (boardState.isWhiteTurn) {
                        capturePiece = ChessPiece.BLACK_PAWN;
                    } else {
                        capturePiece = ChessPiece.WHITE_PAWN;
                    }
                }
                moves.push(new Move(piece, square, rightCaptureSquare, [], capturePiece, ChessPiece.EMPTY));
            }
        }
        moves = GameHelper._filterMovesViolateKingCheck(boardState, moves);
        moves = GameHelper._addKingCheckSquaresForMoves(boardState, moves);
        return moves;
    }

    static getLegalMovesForKnight(boardState: Board, square: Square): Move[] {
        const piece = boardState.getPieceBySquare(square);
        let moves: Move[] = [];
        const landSquares = getPossibleLandSquaresForKnight(square);
        for (let landSquare of landSquares) {
            if (landSquare.isOutsideBoard()) continue;
            const landPiece = boardState.getPieceBySquare(landSquare);
            if (landPiece === ChessPiece.EMPTY) {
                moves.push(new Move(piece, square, landSquare, [], ChessPiece.EMPTY, ChessPiece.EMPTY));
            } else if (GameHelper.isCapturableSquare(boardState, landSquare)) {
                moves.push(new Move(piece, square, landSquare, [], landPiece, ChessPiece.EMPTY));
            }
        }
        moves = GameHelper._filterMovesViolateKingCheck(boardState, moves);
        moves = GameHelper._addKingCheckSquaresForMoves(boardState, moves);
        return moves;
    }

    static getLegalMovesForBishop(boardState: Board, square: Square): Move[] {
        const piece = boardState.getPieceBySquare(square);
        let moves: Move[] = [];
        for (let [rankDir, fileDir] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
            let travelDis = 0;
            while (true) {
                travelDis++;
                const landSquare = new Square(square.rank + travelDis * rankDir, square.file + travelDis * fileDir);
                if (landSquare.isOutsideBoard()) {
                    break;
                }
                const landPiece = boardState.getPieceBySquare(landSquare);
                if (landPiece === ChessPiece.EMPTY) {
                    moves.push(new Move(piece, square, landSquare, [], ChessPiece.EMPTY, ChessPiece.EMPTY));
                    continue;
                }
                if (GameHelper.isCapturableSquare(boardState, landSquare)) {
                    moves.push(new Move(piece, square, landSquare, [], landPiece, ChessPiece.EMPTY));
                }
                break;
            }
        }
        moves = GameHelper._filterMovesViolateKingCheck(boardState, moves);
        moves = GameHelper._addKingCheckSquaresForMoves(boardState, moves);
        return moves;
    }

    static getLegalMovesForRook(boardState: Board, square: Square): Move[] {
        const piece = boardState.getPieceBySquare(square);
        let moves: Move[] = [];
        for (let [rankDir, fileDir] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            let travelDis = 0;
            while (true) {
                travelDis++;
                const landSquare = new Square(square.rank + travelDis * rankDir, square.file + travelDis * fileDir);
                if (landSquare.isOutsideBoard()) break;
                const landPiece = boardState.getPieceBySquare(landSquare);
                if (landPiece === ChessPiece.EMPTY) {
                    moves.push(new Move(piece, square, landSquare, [], ChessPiece.EMPTY, ChessPiece.EMPTY));
                    continue;
                }
                if (GameHelper.isCapturableSquare(boardState, landSquare)) {
                    moves.push(new Move(piece, square, landSquare, [], landPiece, ChessPiece.EMPTY));
                }
                break;
            }
        }
        moves = GameHelper._filterMovesViolateKingCheck(boardState, moves);
        moves = GameHelper._addKingCheckSquaresForMoves(boardState, moves);
        return moves;
    }

    static getLegalMovesForQueen(boardState: Board, square: Square): Move[] {
        const piece = boardState.getPieceBySquare(square);
        let moves: Move[] = [];
        for (let [rankDir, fileDir] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
            let travelDis = 0;
            while (true) {
                travelDis++;
                const landSquare = new Square(square.rank + travelDis * rankDir, square.file + travelDis * fileDir);
                if (landSquare.isOutsideBoard()) break;
                const landPiece = boardState.getPieceBySquare(landSquare);
                if (landPiece === ChessPiece.EMPTY) {
                    moves.push(new Move(piece, square, landSquare, [], ChessPiece.EMPTY, ChessPiece.EMPTY));
                    continue;
                }
                if (GameHelper.isCapturableSquare(boardState, landSquare)) {
                    moves.push(new Move(piece, square, landSquare, [], landPiece, ChessPiece.EMPTY));
                }
                break;
            }
        }
        moves = GameHelper._filterMovesViolateKingCheck(boardState, moves);
        moves = GameHelper._addKingCheckSquaresForMoves(boardState, moves);
        return moves;
    }

    static getLegalMovesForKing(boardState: Board, square: Square): Move[] {
        const piece = boardState.getPieceBySquare(square);
        const enemyKingSquare = boardState.isWhiteTurn ? boardState.material.blackKingSquare : boardState.material.whiteKingSquare;
        let moves: Move[] = [];
        const landSquares = [
            new Square(square.rank + 1, square.file - 1),
            new Square(square.rank + 1, square.file),
            new Square(square.rank + 1, square.file + 1),
            new Square(square.rank, square.file - 1),
            new Square(square.rank, square.file + 1),
            new Square(square.rank - 1, square.file - 1),
            new Square(square.rank - 1, square.file),
            new Square(square.rank - 1, square.file + 1)
        ];
        for (let landSquare of landSquares) {
            if (landSquare.isOutsideBoard()) continue;
            const landPiece = boardState.getPieceBySquare(landSquare);
            if (landPiece === ChessPiece.EMPTY && landSquare.distanceFrom(enemyKingSquare) > 1) {
                moves.push(new Move(piece, square, landSquare, [], ChessPiece.EMPTY, ChessPiece.EMPTY));
            }
            if (GameHelper.isCapturableSquare(boardState, landSquare)) {
                moves.push(new Move(piece, square, landSquare, [], landPiece, ChessPiece.EMPTY));
            }
        }
        const hasKingsideCastleRights = (boardState.isWhiteTurn && boardState.canWhiteCastleKingside) ||
            (!boardState.isWhiteTurn && boardState.canBlackCastleKingside);
        if (hasKingsideCastleRights) {
            const squareF = new Square(square.rank, 6);
            const pieceF = boardState.getPieceBySquare(squareF);
            const squareG = new Square(square.rank, 7);
            const pieceG = boardState.getPieceBySquare(squareG);
            let checkedBetween = false;
            if (boardState.isWhiteTurn) {
                boardState.material.whiteKingSquare = squareF;
                if (GameHelper.getPieceSquaresCheckingKing(boardState, true).length) {
                    checkedBetween = true;
                }
                boardState.material.whiteKingSquare = square;
            } else {
                boardState.material.blackKingSquare = squareF;
                if (GameHelper.getPieceSquaresCheckingKing(boardState, false).length) {
                    checkedBetween = true;
                }
                boardState.material.blackKingSquare = square;
            }
            if (pieceF === ChessPiece.EMPTY && pieceG === ChessPiece.EMPTY && !checkedBetween) {
                moves.push(new Move(piece, square, squareG, [], ChessPiece.EMPTY, ChessPiece.EMPTY));
            }
        }
        const hasQueensideCastleRights = (boardState.isWhiteTurn && boardState.canWhiteCastleQueenside) ||
            (!boardState.isWhiteTurn && boardState.canBlackCastleQueenside);
        if (hasQueensideCastleRights) {
            const squareD = new Square(square.rank, 4);
            const pieceD = boardState.getPieceBySquare(squareD);
            const squareC = new Square(square.rank, 3);
            const pieceC = boardState.getPieceBySquare(squareC);
            const squareB = new Square(square.rank, 2);
            const pieceB = boardState.getPieceBySquare(squareB);
            let checkedBetween = false;
            if (boardState.isWhiteTurn) {
                boardState.material.whiteKingSquare = squareD;
                if (GameHelper.getPieceSquaresCheckingKing(boardState, true).length) {
                    checkedBetween = true;
                }
                boardState.material.whiteKingSquare = square;
            } else {
                boardState.material.blackKingSquare = squareD;
                if (GameHelper.getPieceSquaresCheckingKing(boardState, false).length) {
                    checkedBetween = true;
                }
                boardState.material.blackKingSquare = square;
            }
            if (pieceB === ChessPiece.EMPTY && pieceC === ChessPiece.EMPTY && pieceD === ChessPiece.EMPTY && !checkedBetween) {
                moves.push(new Move(piece, square, squareC, [], ChessPiece.EMPTY, ChessPiece.EMPTY));
            }
        }
        moves = GameHelper._filterMovesViolateKingCheck(boardState, moves);
        moves = GameHelper._addKingCheckSquaresForMoves(boardState, moves);
        return moves;
    }

    static getPieceSquaresCheckingKing(boardState: Board, isWhiteKing: boolean | null = null): Square[] {
        if (isWhiteKing == null) {
            isWhiteKing = boardState.isWhiteTurn;
        }
        const pieceSquaresCheckingKing: Square[] = [];
        const kingSquare = isWhiteKing ? boardState.material.whiteKingSquare : boardState.material.blackKingSquare;
        const enemyKingSquare = isWhiteKing ? boardState.material.blackKingSquare : boardState.material.whiteKingSquare;
        // check for adjacent kings
        if (kingSquare.distanceFrom(enemyKingSquare) < 2) {
            pieceSquaresCheckingKing.push(enemyKingSquare);
        }
        // check for knight checks
        const knightCheckSquares: Square[] = [
            new Square(kingSquare.rank + 2, kingSquare.file + 1),
            new Square(kingSquare.rank + 1, kingSquare.file + 2),
            new Square(kingSquare.rank - 1, kingSquare.file + 2),
            new Square(kingSquare.rank - 2, kingSquare.file + 1),
            new Square(kingSquare.rank - 2, kingSquare.file - 1),
            new Square(kingSquare.rank - 1, kingSquare.file - 2),
            new Square(kingSquare.rank + 1, kingSquare.file - 2),
            new Square(kingSquare.rank + 2, kingSquare.file - 1),
        ];
        for (let knightCheckSquare of knightCheckSquares) {
            if (knightCheckSquare.isOutsideBoard()) continue;
            const pieceInKnightCheckSquare = boardState.getPieceBySquare(knightCheckSquare);
            if (pieceInKnightCheckSquare === ChessPiece.EMPTY) continue;
            if (ChessPieceHelper.isWhite(pieceInKnightCheckSquare) === isWhiteKing) continue;
            if (!ChessPieceHelper.isKnight(pieceInKnightCheckSquare)) continue;
            pieceSquaresCheckingKing.push(knightCheckSquare);
        }
        // check for pawns
        const pawnCheckSquares: Square[] = isWhiteKing ?
            [
                new Square(kingSquare.rank + 1, kingSquare.file + 1),
                new Square(kingSquare.rank + 1, kingSquare.file - 1)
            ]
            :
            [
                new Square(kingSquare.rank - 1, kingSquare.file + 1),
                new Square(kingSquare.rank - 1, kingSquare.file - 1)
            ]
        for (let pawnCheckSquare of pawnCheckSquares) {
            if (pawnCheckSquare.isOutsideBoard()) continue;
            const piece = boardState.getPieceBySquare(pawnCheckSquare);
            if (ChessPieceHelper.isWhite(piece) === isWhiteKing) continue;
            if (ChessPieceHelper.isPawn(piece)) {
                pieceSquaresCheckingKing.push(pawnCheckSquare);
            }
        }
        // check diagonals for bishops and queens
        const diagDirs = [
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1]
        ];
        for (let diagDir of diagDirs) {
            const diagSquare = new Square(kingSquare.rank, kingSquare.file);
            while (true) {
                diagSquare.rank += diagDir[0];
                diagSquare.file += diagDir[1];
                if (diagSquare.isOutsideBoard()) break;
                const piece = boardState.getPieceBySquare(diagSquare);
                if (piece === ChessPiece.EMPTY) continue;
                if (ChessPieceHelper.isWhite(piece) === isWhiteKing) break;
                if (!ChessPieceHelper.isBishop(piece) && !ChessPieceHelper.isQueen(piece)) break;
                pieceSquaresCheckingKing.push(diagSquare);
                break;
            }
        }
        // check straights for rooks and queens
        const StraightDirs = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];
        for (let straightDir of StraightDirs) {
            const straightSquare = new Square(kingSquare.rank, kingSquare.file);
            while (true) {
                straightSquare.rank += straightDir[0];
                straightSquare.file += straightDir[1];
                if (straightSquare.isOutsideBoard()) break;
                const piece = boardState.getPieceBySquare(straightSquare);
                if (piece === ChessPiece.EMPTY) continue;
                if (ChessPieceHelper.isWhite(piece) === isWhiteKing) break;
                if (!ChessPieceHelper.isRook(piece) && !ChessPieceHelper.isQueen(piece)) break;
                pieceSquaresCheckingKing.push(straightSquare);
                break;
            }
        }
        return pieceSquaresCheckingKing;
    }

    static isCapturableSquare(boardState: Board, target: Square, isAttackerPawn = false): boolean {
        if (target.isOutsideBoard()) return false;
        if (isAttackerPawn && boardState.enPassantSquare
            && boardState.enPassantSquare.equalTo(target)) {
            return true;
        }
        const piece = boardState.getPieceBySquare(target);
        if (piece === ChessPiece.EMPTY) return false;
        return boardState.isWhiteTurn !== ChessPieceHelper.isWhite(piece);
    }

    static isForcedDraw(material: Material): boolean {
        if (material.pawns[0] || material.pawns[1]) return false;
        if (material.queens[0] || material.queens[1]) return false;
        if (material.rooks[0] || material.rooks[1]) return false;

        if (material.lightSquareBishops[0] && material.darkSquareBishops[0]) return false;
        if (material.knights[0] > 1) return false;
        const whiteBishops = material.lightSquareBishops[0] + material.darkSquareBishops[0];
        if (whiteBishops && material.knights[0]) return false;

        if (material.lightSquareBishops[1] && material.darkSquareBishops[1]) return false;
        if (material.knights[1] > 1) return false;
        const blackBishops = material.lightSquareBishops[1] + material.darkSquareBishops[1];
        if (blackBishops && material.knights[1]) return false;

        return true;
    }

    private static _filterMovesViolateKingCheck(boardState: Board, moves: Move[]): Move[] {
        const outMoves: Move[] = [];
        for (let move of moves) {
            const updatedPiecesBoardState = move.getUpdatedBoardStatePieces(boardState);
            const checksOnActiveKing = GameHelper.getPieceSquaresCheckingKing(
                updatedPiecesBoardState, boardState.isWhiteTurn);
            if (checksOnActiveKing.length === 0) {
                outMoves.push(move);
            }
        }
        return outMoves;
    }

    private static _addKingCheckSquaresForMoves(boardState: Board, moves: Move[]): Move[] {
        for (let move_i = 0; move_i < moves.length; move_i++) {
            const move = moves[move_i];
            const resultingBoardState = move.getUpdatedBoardStatePieces(boardState);
            move.addSquaresCheckingKing(GameHelper.getPieceSquaresCheckingKing(resultingBoardState, !boardState.isWhiteTurn));
        }
        return moves;
    }
}

export function getPossibleLandSquaresForPawn(isWhite: boolean, square: Square): Square[] {
    const moves: Square[] = [];
    const rankDir = isWhite ? 1 : -1;
    const squareInFront = new Square(square.rank + rankDir, square.file);
    moves.push(squareInFront);
    const leftCaptureSquare = new Square(square.rank + rankDir, square.file - 1);
    moves.push(leftCaptureSquare);
    const rightCaptureSquare = new Square(square.rank + rankDir, square.file + 1);
    moves.push(rightCaptureSquare);
    if (square.rank === 2) {
        const squareTwoInFront = new Square(square.rank + 2 * rankDir, square.file);
        moves.push(squareTwoInFront);
    } else if (square.rank === 7) {
        const squareTwoInFront = new Square(square.rank + 2 * rankDir, square.file);
        moves.push(squareTwoInFront);
    }
    return moves.filter(square => !square.isOutsideBoard())
}

export function getPossibleLandSquaresForKnight(square: Square): Square[] {
    const landSquares = [
        new Square(square.rank + 2, square.file + 1),
        new Square(square.rank + 2, square.file - 1),
        new Square(square.rank + 1, square.file + 2),
        new Square(square.rank + 1, square.file - 2),
        new Square(square.rank - 1, square.file + 2),
        new Square(square.rank - 1, square.file - 2),
        new Square(square.rank - 2, square.file + 1),
        new Square(square.rank - 2, square.file - 1),
    ];
    return landSquares.filter(square => !square.isOutsideBoard());
}

export function getPossibleLandSquaresForBishop(square: Square): Square[] {
    const landSquares: Square[] = [];
    const dirs = [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1]
    ];
    for (let dir of dirs) {
        for (let i = 1; i < 8; i++) {
            const landSquare = new Square(
                square.rank + i * dir[0],
                square.file + i * dir[1]
            );
            if (landSquare.isOutsideBoard()) break;
            landSquares.push(landSquare);
        }
    }
    return landSquares;
}

export function getPossibleLandSquaresForRook(square: Square): Square[] {
    const landSquares: Square[] = [];
    const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];
    for (let dir of dirs) {
        for (let i = 1; i < 8; i++) {
            const landSquare = new Square(
                square.rank + i * dir[0],
                square.file + i * dir[1]
            );
            if (landSquare.isOutsideBoard()) break;
            landSquares.push(landSquare);
        }
    }
    return landSquares;
}

export function getPossibleLandSquaresForQueen(square: Square): Square[] {
    const landSquares: Square[] = [];
    const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1]
    ];
    for (let dir of dirs) {
        for (let i = 1; i < 8; i++) {
            const landSquare = new Square(
                square.rank + i * dir[0],
                square.file + i * dir[1]
            );
            if (landSquare.isOutsideBoard()) break;
            landSquares.push(landSquare);
        }
    }
    return landSquares;
}

export function getPossibleLandSquaresForKing(canKingsideCastle: boolean, canQueensideCastle: boolean, square: Square): Square[] {
    const landSquares: Square[] = [
        new Square(square.rank + 1, square.file - 1),
        new Square(square.rank + 1, square.file),
        new Square(square.rank + 1, square.file + 1),
        new Square(square.rank, square.file - 1),
        new Square(square.rank, square.file + 1),
        new Square(square.rank - 1, square.file - 1),
        new Square(square.rank - 1, square.file),
        new Square(square.rank - 1, square.file + 1),
    ];
    if (canKingsideCastle) {
        landSquares.push(new Square(square.rank, 7));
    }
    if (canQueensideCastle) {
        landSquares.push(new Square(square.rank, 3));
    }
    return landSquares.filter(square => !square.isOutsideBoard());
}

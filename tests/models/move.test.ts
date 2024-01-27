import {ChessPiece} from "../../src/models/domain/chess_piece";
import {Square} from "../../src/models/domain/square";
import {BoardState} from "../../src/models/domain/board_state";
import {Move} from "../../src/models/domain/move";


const assert = (condition: boolean, msg: string | undefined = undefined) => {
    if (!condition) {
        throw new Error(msg);
    }
}

const compareBoardStates = (expBoardState: BoardState, actualBoardState: BoardState) => {
    for (let r = 0; r < expBoardState.pieces.length; r++) {
        for (let c = 0; c < expBoardState.pieces[0].length; c++) {
            const pieceA = expBoardState.pieces[r][c];
            const pieceB = actualBoardState.pieces[r][c];
            assert(pieceA === pieceB);
            assert(expBoardState.isWhiteTurn === actualBoardState.isWhiteTurn);
            assert(expBoardState.canWhiteCastleKingside === actualBoardState.canWhiteCastleKingside);
            assert(expBoardState.canWhiteCastleQueenside === actualBoardState.canWhiteCastleQueenside);
            assert(expBoardState.canBlackCastleKingside === actualBoardState.canBlackCastleKingside);
            assert(expBoardState.canBlackCastleQueenside === actualBoardState.canBlackCastleQueenside);
            if (expBoardState.enPassantSquare) {
                if (!actualBoardState.enPassantSquare) {
                    throw new Error();
                }
                assert(expBoardState.enPassantSquare.equalTo(actualBoardState.enPassantSquare));
            } else if (actualBoardState.enPassantSquare) {
                throw new Error();
            }
            assert(expBoardState.halfMoveClockCount === actualBoardState.halfMoveClockCount);
            assert(expBoardState.fullMoveCount === actualBoardState.fullMoveCount);
            assert(expBoardState.isTerminal === actualBoardState.isTerminal);
            assert(expBoardState.isWhiteWinner === actualBoardState.isWhiteWinner);
            assert(expBoardState.isBlackWinner === actualBoardState.isBlackWinner);
        }
    }
}
describe("Move", () => {
    describe("::getResultingBoardState", () => {
        describe("when the move is a capture", () => {
            describe("and the capture is not an en passant move", () => {
                it("the capturing piece moves and replaces the captured piece", () => {
                    const boardState = BoardState.fromFEN("k7/p2n4/8/8/6B1/8/8/7K w - - 0 1");
                    const move = new Move(ChessPiece.WHITE_BISHOP, new Square(4, 7),
                        new Square(7, 4), [], ChessPiece.BLACK_KNIGHT, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_BISHOP, new Square(7, 4));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(4, 7));
                    expResultingBoardState.isWhiteTurn = false;
                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
            describe("and the capture is an en passant move", () => {
                it("the capturing pawn moves to the en passant square and the captured pawn is removed", () => {
                    const boardState = BoardState.fromFEN("k7/8/4pP2/8/8/8/8/7K w - e7 0 1");
                    const move = new Move(ChessPiece.WHITE_PAWN, new Square(6, 6), new Square(7, 5), [], ChessPiece.BLACK_PAWN, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_PAWN, new Square(7, 5));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(6, 5));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(6, 6));
                    expResultingBoardState.isWhiteTurn = false;
                    expResultingBoardState.enPassantSquare = null;

                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
        });
        describe("when the move is not a capture", () => {
            describe("and the move is not a pawn upgrade", () => {
                it("the moving piece moves", () => {
                    const boardState = BoardState.fromFEN("k7/4r3/8/8/8/8/5N2/7K w - - 0 1");
                    const move = new Move(ChessPiece.WHITE_KNIGHT, new Square(2, 6), new Square(3, 4), [], null, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_KNIGHT, new Square(3, 4));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(2, 6));
                    expResultingBoardState.isWhiteTurn = false;
                    expResultingBoardState.halfMoveClockCount = 1;
                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
            describe("and the move is a pawn upgrade", () => {
                it("the pawn converts into a new piece and moves", () => {
                    const boardState = BoardState.fromFEN("8/5P2/8/8/8/1kb5/8/7K w - - 0 1");
                    const move = new Move(ChessPiece.WHITE_PAWN, new Square(7, 6), new Square(8, 6), [], null, ChessPiece.WHITE_ROOK);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_ROOK, new Square(8, 6));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(7, 6));
                    expResultingBoardState.isWhiteTurn = false;
                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
            describe("and the move allows for en passant", () => {
                it("sets the en passant square", () => {
                    const boardState = BoardState.fromFEN("8/8/8/8/7K/8/4P3/k7 w - - 0 1");
                    const move = new Move(ChessPiece.WHITE_PAWN, new Square(2, 5), new Square(4, 5), [], null, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_PAWN, new Square(4, 5));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(2, 5));
                    expResultingBoardState.isWhiteTurn = false;
                    expResultingBoardState.enPassantSquare = new Square(3, 5);
                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
        });
        describe("when the resulting board state is terminal", () => {
            describe("and white is the winner", () => {
                it("sets the winner to white, isTerminal to true", () => {
                    const boardState = BoardState.fromFEN("8/8/8/8/7K/6Q1/7R/k7 w - - 0 1");
                    const move = new Move(ChessPiece.WHITE_QUEEN, new Square(3, 7), new Square(1, 5), [new Square(1, 5)], null, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expBoardState = boardState.copy();
                    expBoardState.setPieceOnSquare(ChessPiece.WHITE_QUEEN, new Square(1, 5));
                    expBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(3, 7));
                    expBoardState.isTerminal = true;
                    expBoardState.isWhiteWinner = true;
                    expBoardState.isBlackWinner = false;
                    expBoardState.isWhiteTurn = false;
                    expBoardState.halfMoveClockCount++;
                    compareBoardStates(expBoardState, resultingBoardState);
                });
            });
            describe("and black is the winner", () => {
                it("sets the winner to black, isTerminal to true", () => {

                });
            });
            describe("and its a draw", () => {
                it("sets isDraw to true, isTerminal to true", () => {

                });
            });
        });
        describe("when its black's move", () => {
            it("increments the full move counter", () => {
                const boardState = BoardState.fromFEN("8/8/8/8/7K/2q5/4P3/k7 b - - 0 1");
                const move = new Move(ChessPiece.BLACK_QUEEN, new Square(3, 3), new Square(1, 5), [new Square(1, 5)], null, null);
                const resultingBoardState = move.getResultingBoardState(boardState);
                const expResultingBoardState = boardState.copy();
                expResultingBoardState.halfMoveClockCount++;
                expResultingBoardState.fullMoveCount++;
                expResultingBoardState.isWhiteTurn = true;
                expResultingBoardState.setPieceOnSquare(ChessPiece.BLACK_QUEEN, new Square(1, 5));
                expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(3, 3));
                compareBoardStates(expResultingBoardState, resultingBoardState);
            });
        });
        describe("when a rook moves, revoking a castling right", () => {
            describe("and the rook is white's kingside rook", () => {
                it("removes white's kingside castling right", () => {
                    const boardState = BoardState.fromFEN("r3k2r/2q5/8/8/8/8/4P3/R3K2R w KQkq - 0 1");
                    const move = new Move(ChessPiece.WHITE_ROOK, new Square(1, 8), new Square(1, 7), [], null, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_ROOK, new Square(1, 7));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(1, 8));
                    expResultingBoardState.canWhiteCastleKingside = false;
                    expResultingBoardState.isWhiteTurn = false;
                    expResultingBoardState.halfMoveClockCount++;
                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
            describe("and the rook is white's queenside rook", () => {
                it("removes white's queenside castling right", () => {
                    const boardState = BoardState.fromFEN("r3k2r/2q5/8/8/8/8/4P3/R3K2R w KQkq - 0 1");
                    const move = new Move(ChessPiece.WHITE_ROOK, new Square(1, 1), new Square(1, 2), [], null, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_ROOK, new Square(1, 2));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(1, 1));
                    expResultingBoardState.canWhiteCastleQueenside = false;
                    expResultingBoardState.isWhiteTurn = false;
                    expResultingBoardState.halfMoveClockCount++;
                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
            describe("and the rook is black's kingside rook", () => {
                it("removes black's kingside castling right", () => {
                    const boardState = BoardState.fromFEN("r3k2r/2q5/8/8/8/8/4P3/R3K2R b KQ - 0 1");
                    const move = new Move(ChessPiece.BLACK_ROOK, new Square(8, 8), new Square(8, 7), [], null, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.setPieceOnSquare(ChessPiece.BLACK_ROOK, new Square(8, 7));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(8, 8));
                    expResultingBoardState.canBlackCastleKingside = false;
                    expResultingBoardState.isWhiteTurn = true;
                    expResultingBoardState.halfMoveClockCount++;
                    expResultingBoardState.fullMoveCount++;
                    compareBoardStates(expResultingBoardState, resultingBoardState);

                });
            });
            describe("and the rook is black's queenside rook", () => {
                it("removes black's queenside castling right", () => {
                    const boardState = BoardState.fromFEN("r3k2r/2q5/8/8/8/8/4P3/R3K2R b KQ - 0 1");
                    const move = new Move(ChessPiece.BLACK_ROOK, new Square(8, 1), new Square(8, 2), [], null, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.setPieceOnSquare(ChessPiece.BLACK_ROOK, new Square(8, 2));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(8, 1));
                    expResultingBoardState.canBlackCastleQueenside = false;
                    expResultingBoardState.isWhiteTurn = true;
                    expResultingBoardState.halfMoveClockCount++;
                    expResultingBoardState.fullMoveCount++;
                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
        });
        describe("when a king moves", () => {
            it("updates the king square", () => {
                const boardState = BoardState.fromFEN("r3k2r/2q5/8/8/8/8/4P3/R3K2R b KQ - 0 1");
                const move = new Move(ChessPiece.BLACK_KING, new Square(8, 5), new Square(8, 6), [], null, null);
                const resultingBoardState = move.getResultingBoardState(boardState);
                const expResultingBoardState = boardState.copy();
                expResultingBoardState.setPieceOnSquare(ChessPiece.BLACK_KING, new Square(8, 6));
                expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(8, 5));
                expResultingBoardState.canBlackCastleQueenside = false;
                expResultingBoardState.canBlackCastleKingside = false;
                expResultingBoardState.isWhiteTurn = true;
                expResultingBoardState.halfMoveClockCount++;
                expResultingBoardState.fullMoveCount++;
                compareBoardStates(expResultingBoardState, resultingBoardState);
            });
            describe("and the acting player had both castling rights", () => {
                it("revokes castling rights for the moving player", () => {
                    const boardState = BoardState.fromFEN("r3k2r/2q5/8/8/8/8/4P3/R3K2R b KQ - 0 1");
                    const move = new Move(ChessPiece.BLACK_KING, new Square(8, 5), new Square(8, 6), [], null, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.setPieceOnSquare(ChessPiece.BLACK_KING, new Square(8, 6));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(8, 5));
                    expResultingBoardState.canBlackCastleQueenside = false;
                    expResultingBoardState.canBlackCastleKingside = false;
                    expResultingBoardState.isWhiteTurn = true;
                    expResultingBoardState.halfMoveClockCount++;
                    expResultingBoardState.fullMoveCount++;
                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
        });
        describe("when the move is castles", () => {
            describe("and white castles kingside", () => {
                it("re-positions the king and king's rook", () => {
                    const boardState = BoardState.fromFEN("r3k2r/8/8/8/8/8/4P3/R3K2R w KQ - 0 1");
                    const move = new Move(ChessPiece.WHITE_KING, new Square(1, 5), new Square(1, 7), [], null, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.canWhiteCastleKingside = false;
                    expResultingBoardState.canWhiteCastleQueenside = false;
                    expResultingBoardState.isWhiteTurn = false;
                    expResultingBoardState.halfMoveClockCount++;
                    expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_KING, new Square(1, 7));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_ROOK, new Square(1, 6));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(1, 5));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(1, 8));
                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
            describe("and white castles queenside", () => {
                it("re-positions the king and queen's rook", () => {
                    const boardState = BoardState.fromFEN("r3k2r/8/8/8/8/8/4P3/R3K2R w KQ - 0 1");
                    const move = new Move(ChessPiece.WHITE_KING, new Square(1, 5), new Square(1, 3), [], null, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.canWhiteCastleKingside = false;
                    expResultingBoardState.canWhiteCastleQueenside = false;
                    expResultingBoardState.isWhiteTurn = false;
                    expResultingBoardState.halfMoveClockCount++;
                    expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_KING, new Square(1, 3));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_ROOK, new Square(1, 4));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(1, 5));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(1, 1));
                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
            describe("and black castles kingside", () => {
                it("re-positions the king and king's rook", () => {
                    const boardState = BoardState.fromFEN("r3k2r/8/8/8/8/8/4P3/R3K2R b KQ - 0 1");
                    const move = new Move(ChessPiece.BLACK_KING, new Square(8, 5), new Square(8, 7), [], null, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.canBlackCastleKingside = false;
                    expResultingBoardState.canBlackCastleQueenside = false;
                    expResultingBoardState.isWhiteTurn = true;
                    expResultingBoardState.halfMoveClockCount++;
                    expResultingBoardState.fullMoveCount++;
                    expResultingBoardState.setPieceOnSquare(ChessPiece.BLACK_KING, new Square(8, 7));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.BLACK_ROOK, new Square(8, 6));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(8, 5));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(8, 8));
                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
            describe("and black castles queenside", () => {
                it("re-positions the king and queen's rook", () => {
                    const boardState = BoardState.fromFEN("r3k2r/8/8/8/8/8/4P3/R3K2R b KQ - 0 1");
                    const move = new Move(ChessPiece.BLACK_KING, new Square(8, 5), new Square(8, 3), [], null, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.canBlackCastleKingside = false;
                    expResultingBoardState.canBlackCastleQueenside = false;
                    expResultingBoardState.isWhiteTurn = true;
                    expResultingBoardState.halfMoveClockCount++;
                    expResultingBoardState.fullMoveCount++;
                    expResultingBoardState.setPieceOnSquare(ChessPiece.BLACK_KING, new Square(8, 3));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.BLACK_ROOK, new Square(8, 4));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(8, 5));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(8, 1));
                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
        });
        describe("when the move results in stalemate", () => {
            it("results in a draw state", () => {
                const boardState = BoardState.fromFEN("k7/7K/3Q4/8/8/8/8/8 w - - 0 1");
                const move = new Move(ChessPiece.WHITE_QUEEN, new Square(6, 4), new Square(6, 2), [], null, null);
                const resultingBoardState = move.getResultingBoardState(boardState);
                const expResultingBoardState = boardState.copy();
                expResultingBoardState.isTerminal = true;
                expResultingBoardState.isWhiteWinner = false;
                expResultingBoardState.isBlackWinner = false;
                expResultingBoardState.isWhiteTurn = false;
                expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_QUEEN, new Square(6, 2));
                expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(6, 4));
                expResultingBoardState.halfMoveClockCount++;
                compareBoardStates(expResultingBoardState, resultingBoardState);
            });
        });
        describe("when the resulting move violates the 50-move rule", () => {
            it("results in a draw state", () => {
                const boardState = BoardState.fromFEN("kr6/pp6/8/8/8/5N2/8/7K w - - 49 32");
                const move = new Move(ChessPiece.WHITE_KNIGHT, new Square(3, 6), new Square(4, 4), [], null, null);
                const resultingBoardState = move.getResultingBoardState(boardState);
                const expResultingBoardState = boardState.copy();
                expResultingBoardState.isTerminal = true;
                expResultingBoardState.isWhiteWinner = false;
                expResultingBoardState.isBlackWinner = false;
                expResultingBoardState.isWhiteTurn = false;
                expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_KNIGHT, new Square(4, 4));
                expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(3, 6));
                expResultingBoardState.halfMoveClockCount++;
                compareBoardStates(expResultingBoardState, resultingBoardState);
            });
        });
        describe("when remaining material forces a draw", () => {
            describe("when only the kings are on the board", () => {
                it("results in a draw", () => {
                    const boardState = BoardState.fromFEN("8/k7/8/8/8/4pK2/8/8 w - - 0 1");
                    const move = new Move(ChessPiece.WHITE_KING, new Square(3, 6), new Square(3, 5), [], ChessPiece.BLACK_PAWN, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.isWhiteTurn = false;
                    expResultingBoardState.isTerminal = true;
                    expResultingBoardState.isWhiteWinner = false;
                    expResultingBoardState.isBlackWinner = false;
                    expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_KING, new Square(3, 5));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(3, 6));
                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
            describe("when only one bishop exists", () => {
                it("results in a draw", () => {

                });
            });
            describe("when both players have one bishop", () => {
                it("results in a draw", () => {

                });
            });
            describe("when a player has two same colored bishops", () => {
                it("results in a draw", () => {

                });
            });
            describe("when only one knight exists", () => {
                it("results in a draw", () => {

                });
            });
            describe("when both players have only one knight", () => {
                it("results in a draw", () => {

                });
            });
        });
        describe("when remaining material does not force a draw", () => {
            describe("when only one rook exists", () => {
                it("does not result in a draw", () => {

                });
            });
            describe("when only one queen exists", () => {
                it("does not result in a draw", () => {

                });
            });
            describe("when only one pawn exists", () => {
                it("does not result in a draw", () => {
                    const boardState = BoardState.fromFEN("8/8/8/8/6PK/8/8/k7 w - - 0 1");
                    const move = new Move(ChessPiece.WHITE_PAWN, new Square(4, 7), new Square(5, 7), [], null, null);
                    const resultingBoardState = move.getResultingBoardState(boardState);
                    const expResultingBoardState = boardState.copy();
                    expResultingBoardState.isWhiteTurn = false;
                    expResultingBoardState.setPieceOnSquare(ChessPiece.WHITE_PAWN, new Square(5, 7));
                    expResultingBoardState.setPieceOnSquare(ChessPiece.EMPTY, new Square(4, 7));
                    compareBoardStates(expResultingBoardState, resultingBoardState);
                });
            });
            describe("when a player has two different colored bishops", () => {
                it("does not result in a draw", () => {

                });
            });
            describe("when only one player has a bishop and knight", () => {
                it("does not result in a draw", () => {

                });
            });
            describe("when only one player has two knights", () => {
                it("does not result in a draw", () => {

                });
            });
        });
    });
    describe("::equalTo", () => {
        describe("when the two instances have identical data on all fields", () => {
            it("returns true", () => {
                const moveA = new Move(
                    ChessPiece.WHITE_BISHOP,
                    new Square(1, 2),
                    new Square(1, 3),
                    [new Square(4, 4), new Square(5, 5)],
                    ChessPiece.BLACK_KNIGHT,
                    ChessPiece.WHITE_ROOK);
                const moveB = new Move(
                    ChessPiece.WHITE_BISHOP,
                    new Square(1, 2),
                    new Square(1, 3),
                    [new Square(4, 4), new Square(5, 5)],
                    ChessPiece.BLACK_KNIGHT,
                    ChessPiece.WHITE_ROOK);
                expect(moveA.equalTo(moveB)).toBeTruthy();
            });
        });
        describe("when the two instances being compared differ", () => {
            it("returns false", () => {
                const moveA = new Move(
                    ChessPiece.WHITE_BISHOP,
                    new Square(1, 2),
                    new Square(1, 3),
                    [new Square(4, 4), new Square(5, 5)],
                    ChessPiece.BLACK_KNIGHT,
                    ChessPiece.WHITE_ROOK);
                const moveB = new Move(
                    ChessPiece.WHITE_BISHOP,
                    new Square(1, 2),
                    new Square(1, 3),
                    [new Square(4, 4), new Square(5, 5)],
                    ChessPiece.WHITE_KNIGHT,
                    ChessPiece.WHITE_ROOK);
                expect(moveA.equalTo(moveB)).toBeFalsy();
            });
        });
        describe("when the two instances have congruent data, but not identical", () => {
            it("returns true", () => {
                const moveA = new Move(0, new Square(1, 1), new Square(2, 2), [new Square(3, 3), new Square(4, 4)], null, null);
                const moveB = new Move(0, new Square(1, 1), new Square(2, 2), [new Square(4, 4), new Square(3, 3)], null, null);
                expect(moveA.equalTo(moveB)).toBeTruthy();
            });
        });
    });
});
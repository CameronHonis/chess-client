import {GameHelper} from "../../src/helpers/game_helper";
import {BoardState} from "../../src/models/domain/board_state";
import {Square} from "../../src/models/domain/square";
import {Move} from "../../src/models/domain/move";
import {ChessPiece} from "../../src/models/domain/chess_piece";

const compareMoves = (expMoves: Move[], actualMoves: Move[]) => {
    expect(actualMoves).toBeInstanceOf(Array);
    expect(actualMoves).toHaveLength(expMoves.length);
    for (let actualMove of actualMoves) {
        let hasFoundMatch = false;
        for (let expMove of expMoves) {
            if (actualMove.equalTo(expMove)) {
                hasFoundMatch = true;
                break;
            }
        }
        if (!hasFoundMatch) {
            throw new Error()
        }
        expect(hasFoundMatch).toBeTruthy();
    }
}

describe("GameHelper", () => {
    describe("#getLegalMovesForPawn", () => {
        describe("when the pawn can capture either direction", () => {
            describe("and the square in front is not occupied", () => {
                it("returns the correct moves", () => {
                    const fen = "k7/8/8/4p1n1/5P2/8/8/7K w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(4, 6), new Square(5, 6), [], null, null),
                        new Move(ChessPiece.WHITE_PAWN, new Square(4, 6), new Square(5, 5), [], ChessPiece.BLACK_PAWN, null),
                        new Move(ChessPiece.WHITE_PAWN, new Square(4, 6), new Square(5, 7), [], ChessPiece.BLACK_KNIGHT, null),
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(4, 6));
                    compareMoves(expMoves, actualMoves);
                });
                describe("and the capture results in a check", () => {
                    it("returns the correct moves", () => {
                        const fen = "3qkbnr/Bp1npb1p/2Pp1p2/p4Pp1/4P3/2N5/PPP3PP/R2QKBNR w KQk g6 1 10";
                        const boardState = BoardState.fromFEN(fen);
                        const expMoves = [
                            new Move(ChessPiece.WHITE_PAWN, new Square(6, 3), new Square(7, 4), [new Square(7, 4)], ChessPiece.BLACK_KNIGHT, null),
                            new Move(ChessPiece.WHITE_PAWN, new Square(6, 3), new Square(7, 3), [], null, null),
                            new Move(ChessPiece.WHITE_PAWN, new Square(6, 3), new Square(7, 2), [], ChessPiece.BLACK_PAWN, null),
                        ];
                        const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(6, 3));
                        compareMoves(expMoves, actualMoves);
                    });
                });
            });
            describe("and the square in front is occupied", () => {
                it("returns the correct moves", () => {
                    const fen = "k7/8/8/4ppn1/5P2/8/8/7K w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(4, 6), new Square(5, 5), [], ChessPiece.BLACK_PAWN, null),
                        new Move(ChessPiece.WHITE_PAWN, new Square(4, 6), new Square(5, 7), [], ChessPiece.BLACK_KNIGHT, null),
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(4, 6));
                    compareMoves(expMoves, actualMoves);
                });
            });
        });
        describe("when the pawn can capture in one direction", () => {
            describe("and the square in front is not occupied", () => {
                it("returns the correct moves", () => {
                    const fen = "k7/8/8/4p3/5P2/8/8/7K w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(4, 6), new Square(5, 6), [], null, null),
                        new Move(ChessPiece.WHITE_PAWN, new Square(4, 6), new Square(5, 5), [], ChessPiece.BLACK_PAWN, null),
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(4, 6));
                    compareMoves(expMoves, actualMoves);
                });
            });
            describe("and the square in front is occupied", () => {
                it("returns the correct moves", () => {
                    const fen = "k7/8/8/4rq2/5P2/8/8/7K w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(4, 6), new Square(5, 5), [], ChessPiece.BLACK_ROOK, null),
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(4, 6));
                    compareMoves(expMoves, actualMoves);
                });
            });
        });
        describe("when the pawn cannot capture either direction", () => {
            describe("and the 'attacked' squares are of the same color", () => {
                it("returns the correct moves", () => {
                    const fen = "8/8/k7/8/3B1R2/4P3/7K/8 w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(3, 5), new Square(4, 5), [], null, null)
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(3, 5));
                    compareMoves(expMoves, actualMoves);
                });
            });
            describe("and the square in front is not occupied", () => {
                it("returns the correct moves", () => {
                    const fen = "k7/8/8/8/5P2/8/8/7K w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(4, 6), new Square(5, 6), [], null, null),
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(4, 6));
                    compareMoves(expMoves, actualMoves);
                });
            });
            describe("and the square in front is occupied", () => {
                it("returns the correct moves", () => {
                    const fen = "8/8/8/5n2/5P2/8/8/8 w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves: Move[] = [];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(4, 6));
                    compareMoves(expMoves, actualMoves);
                });
            });
        });
        describe("when the pawn can capture en passant to the left", () => {
            describe("and the square in front is not occupied", () => {
                it("returns the correct moves", () => {
                    const fen = "k7/8/8/4pP2/8/8/8/7K w - e6 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(5, 6), new Square(6, 5), [], ChessPiece.BLACK_PAWN, null),
                        new Move(ChessPiece.WHITE_PAWN, new Square(5, 6), new Square(6, 6), [], null, null)
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(5, 6));
                    compareMoves(expMoves, actualMoves);
                });
            });
            describe("and the square in front is occupied", () => {
                it("returns the correct moves", () => {
                    const fen = "8/8/5Q2/4pP2/8/8/5K2/2k5 w - e6 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(5, 6), new Square(6, 5), [], ChessPiece.BLACK_PAWN, null)
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(5, 6));
                    compareMoves(expMoves, actualMoves);
                });
            });
        });
        describe("when the pawn can capture en passant to the right", () => {
            describe("and the square in front is not occupied", () => {
                it("returns the correct moves", () => {
                    const fen = "k7/8/8/5Pp1/8/8/8/7K w - g6 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(5, 6), new Square(6, 7), [], ChessPiece.BLACK_PAWN, null),
                        new Move(ChessPiece.WHITE_PAWN, new Square(5, 6), new Square(6, 6), [], null, null)
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(5, 6));
                    compareMoves(expMoves, actualMoves);
                });
            });
            describe("and the square in front is occupied", () => {
                it("returns the correct moves", () => {
                    const fen = "8/8/5K2/5Pp1/8/8/8/8 w - g6 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(5, 6), new Square(6, 7), [], ChessPiece.BLACK_PAWN, null)
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(5, 6));
                    compareMoves(expMoves, actualMoves);
                });
            });
        });
        describe("when the pawn is on the starting row", () => {
            describe("and the two squares in front are not occupied", () => {
                it("returns the correct moves", () => {
                    const fen = "k7/8/8/8/8/8/1P6/7K w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(2, 2), new Square(3, 2), [], null, null),
                        new Move(ChessPiece.WHITE_PAWN, new Square(2, 2), new Square(4, 2), [], null, null),
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(2, 2));
                    compareMoves(expMoves, actualMoves);
                });
            });
            describe("and the square two in front is occupied, but not the square directly in front", () => {
                it("returns the correct moves", () => {
                    const fen = "k7/8/8/8/1B6/8/1P6/7K w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(2, 2), new Square(3, 2), [], null, null),
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(2, 2));
                    compareMoves(expMoves, actualMoves);
                });
            });
            describe("and the square in front is occupied", () => {
                it("returns the correct moves", () => {
                    const fen = "8/8/8/8/8/1R6/1P6/8 w - - 0 1"
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves: Move[] = [];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(2, 2));
                    compareMoves(expMoves, actualMoves);
                });
            });
        });
        describe("when the pawn can be promoted", () => {
            describe("and the pawn can capture to the left", () => {
                describe("and the square in front is occupied", () => {
                    it("returns the correct moves", () => {
                        const fen = "rn6/1P6/8/8/8/8/8/1k5K w - - 0 1";
                        const boardState = BoardState.fromFEN(fen);
                        const expMoves = [
                            new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 1), [], ChessPiece.BLACK_ROOK, ChessPiece.WHITE_KNIGHT),
                            new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 1), [], ChessPiece.BLACK_ROOK, ChessPiece.WHITE_BISHOP),
                            new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 1), [], ChessPiece.BLACK_ROOK, ChessPiece.WHITE_ROOK),
                            new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 1), [], ChessPiece.BLACK_ROOK, ChessPiece.WHITE_QUEEN),
                        ];
                        const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(7, 2));
                        compareMoves(expMoves, actualMoves);
                    });
                });
                describe("and the square in front is not occupied", () => {
                    it("returns the correct moves", () => {
                        const fen = "r7/1P6/8/8/8/8/8/2k4K w - - 0 1";
                        const boardState = BoardState.fromFEN(fen);
                        const expMoves = [
                            new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 1), [], ChessPiece.BLACK_ROOK, ChessPiece.WHITE_KNIGHT),
                            new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 1), [], ChessPiece.BLACK_ROOK, ChessPiece.WHITE_BISHOP),
                            new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 1), [], ChessPiece.BLACK_ROOK, ChessPiece.WHITE_ROOK),
                            new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 1), [], ChessPiece.BLACK_ROOK, ChessPiece.WHITE_QUEEN),
                            new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 2), [], null, ChessPiece.WHITE_KNIGHT),
                            new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 2), [], null, ChessPiece.WHITE_BISHOP),
                            new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 2), [], null, ChessPiece.WHITE_ROOK),
                            new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 2), [], null, ChessPiece.WHITE_QUEEN),
                        ];
                        const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(7, 2));
                        compareMoves(expMoves, actualMoves);
                    });
                });
            });
            describe("and the pawn can not capture", () => {
                it("returns the correct moves", () => {
                    const fen = "8/1P6/8/8/k7/8/8/7K w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 2), [], null, ChessPiece.WHITE_KNIGHT),
                        new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 2), [], null, ChessPiece.WHITE_BISHOP),
                        new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 2), [], null, ChessPiece.WHITE_ROOK),
                        new Move(ChessPiece.WHITE_PAWN, new Square(7, 2), new Square(8, 2), [], null, ChessPiece.WHITE_QUEEN),
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(7, 2));
                    compareMoves(expMoves, actualMoves);
                });
            });
        });
        describe("when the pawn is pinned to its king", () => {
            describe("and the pin is coming from a piece on the same file", () => {
                it("returns the correct moves", () => {
                    const fen = "8/4r3/8/8/8/4P3/4K3/8 w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(3, 5), new Square(4, 5), [], null, null),
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(3, 5));
                    compareMoves(expMoves, actualMoves);
                });

            });
            describe("and the pin is coming from a piece on the diagonal", () => {
                it("returns the correct moves", () => {
                    const fen = "8/8/1q6/8/8/4P3/5K2/8 w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves: Move[] = [];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(3, 5));
                    compareMoves(expMoves, actualMoves);
                });
            });
            describe("and the pin is coming from a piece on the rank", () => {
                it("returns the correct moves", () => {
                    const fen = "8/8/8/8/8/1r2PK2/8/8 w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves: Move[] = [];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(3, 5));
                    compareMoves(expMoves, actualMoves);
                });
            });
        });
        describe("when the pawn blocks a check", () => {
            it("returns the move that blocks the check", () => {
                const boardState = BoardState.fromFEN("k7/1b1B4/8/8/8/4PK2/8/8 w - - 0 1");
                const expMoves = [
                    new Move(ChessPiece.WHITE_PAWN, new Square(3, 5), new Square(4, 5), [], null, null)
                ];
                const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(3, 5));
                compareMoves(expMoves, actualMoves);
            });
            describe("and the pawn is able to capture", () => {
                it("only returns the move that blocks the check", () => {
                    const boardState = BoardState.fromFEN("k7/1b1B4/8/8/3q4/4PK2/8/8 w - - 0 1");
                    const expMoves = [
                        new Move(ChessPiece.WHITE_PAWN, new Square(3, 5), new Square(4, 5), [], null, null)
                    ];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(3, 5));
                    compareMoves(expMoves, actualMoves);
                });
            });
            describe("and a knight is also checking the king", () => {
                it("returns no legal moves", () => {
                    const fen = "k7/1b1B4/8/4n3/8/4PK2/8/8 w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const expMoves: Move[] = [];
                    const actualMoves = GameHelper.getLegalMovesForPawn(boardState, new Square(3, 5));
                    compareMoves(expMoves, actualMoves);
                });
            });
        });
    });

    describe("#getLegalMovesForKnight", () => {
        const knight = ChessPiece.WHITE_KNIGHT
        describe("when the knight is in the bottom right corner", () => {
            it("returns two legal moves", () => {
                const boardState = BoardState.fromFEN("k7/1p6/8/8/8/8/8/6KN w - - 0 1");
                const expMoves = [
                    new Move(knight, new Square(1, 8), new Square(2, 6), [], null, null),
                    new Move(knight, new Square(1, 8), new Square(3, 7), [], null, null)
                ];
                const actualMoves = GameHelper.getLegalMovesForKnight(boardState, new Square(1, 8));
                compareMoves(expMoves, actualMoves);
            });
        });
        describe("when the knight is unimpeded in the middle of the board", () => {
            it("returns all eight legal moves", () => {
                const boardState = BoardState.fromFEN("k7/8/8/8/p3N3/8/8/6K1 w - - 0 1");
                const expMoves = [
                    new Move(knight, new Square(4, 5), new Square(6, 4), [], null, null),
                    new Move(knight, new Square(4, 5), new Square(6, 6), [], null, null),
                    new Move(knight, new Square(4, 5), new Square(5, 3), [], null, null),
                    new Move(knight, new Square(4, 5), new Square(5, 7), [], null, null),
                    new Move(knight, new Square(4, 5), new Square(3, 3), [], null, null),
                    new Move(knight, new Square(4, 5), new Square(3, 7), [], null, null),
                    new Move(knight, new Square(4, 5), new Square(2, 4), [], null, null),
                    new Move(knight, new Square(4, 5), new Square(2, 6), [], null, null),
                ];
                const actualMoves = GameHelper.getLegalMovesForKnight(boardState, new Square(4, 5));
                compareMoves(expMoves, actualMoves);
            });
        });

        describe("when different pieces occupy land squares", () => {
            it("returns only moves that capture enemy pieces", () => {
                const boardState = BoardState.fromFEN("k4r2/7N/5P2/6q1/p7/8/8/4K3 w - - 0 1");
                const expMoves = [
                    new Move(knight, new Square(7, 8), new Square(8, 6), [], ChessPiece.BLACK_ROOK, null),
                    new Move(knight, new Square(7, 8), new Square(5, 7), [], ChessPiece.BLACK_QUEEN, null),
                ];
                const actualMoves = GameHelper.getLegalMovesForKnight(boardState, new Square(7, 8));
                compareMoves(expMoves, actualMoves);
            });
        });

        describe("when a move results in a check", () => {
            it("returns the move with the knight's square as the checking square", () => {
                const boardState = BoardState.fromFEN("5B2/7N/5P2/6q1/p7/7k/8/4K3 w - - 0 1");
                const expMoves = [
                    new Move(knight, new Square(7, 8), new Square(5, 7), [new Square(5, 7)], ChessPiece.BLACK_QUEEN, null)
                ];
                const actualMoves = GameHelper.getLegalMovesForKnight(boardState, new Square(7, 8));
                compareMoves(expMoves, actualMoves);
            });
            describe("and the move is a discovered double check", () => {
                it("returns the move with the knight and rook checking the piece", () => {
                    const boardState = BoardState.fromFEN("5B1R/7N/5P2/6q1/p7/7k/8/4K3 w - - 0 1");
                    const expMoves = [
                        new Move(knight, new Square(7, 8), new Square(5, 7), [new Square(5, 7), new Square(8, 8)], ChessPiece.BLACK_QUEEN, null),
                    ];
                    const actualMoves = GameHelper.getLegalMovesForKnight(boardState, new Square(7, 8));
                    compareMoves(expMoves, actualMoves);
                });
            });
        });
    });

    describe("#getLegalMovesForBishop", () => {
        const bishop = ChessPiece.WHITE_BISHOP;
        describe("when the bishop is unimpeded in the middle of the board", () => {
            it("returns 13 legal moves", () => {
                const boardState = BoardState.fromFEN("2K5/8/8/4B3/8/8/8/5k2 w - - 0 1");
                const expMoves = [
                    new Move(bishop, new Square(5, 5), new Square(1, 1), [], null, null),
                    new Move(bishop, new Square(5, 5), new Square(2, 2), [], null, null),
                    new Move(bishop, new Square(5, 5), new Square(3, 3), [], null, null),
                    new Move(bishop, new Square(5, 5), new Square(4, 4), [], null, null),
                    new Move(bishop, new Square(5, 5), new Square(6, 6), [], null, null),
                    new Move(bishop, new Square(5, 5), new Square(7, 7), [], null, null),
                    new Move(bishop, new Square(5, 5), new Square(8, 8), [], null, null),
                    new Move(bishop, new Square(5, 5), new Square(8, 2), [], null, null),
                    new Move(bishop, new Square(5, 5), new Square(7, 3), [], null, null),
                    new Move(bishop, new Square(5, 5), new Square(6, 4), [], null, null),
                    new Move(bishop, new Square(5, 5), new Square(4, 6), [], null, null),
                    new Move(bishop, new Square(5, 5), new Square(3, 7), [], null, null),
                    new Move(bishop, new Square(5, 5), new Square(2, 8), [], null, null),
                ];
                const actualMoves = GameHelper.getLegalMovesForBishop(boardState, new Square(5, 5));
                compareMoves(expMoves, actualMoves);
            });
        });

        describe("when a friendly piece is blocking its path", () => {
            it("does not return moves on or beyond the friendly piece", () => {
                const boardState = BoardState.fromFEN("2K5/8/8/8/3P4/8/8/B4k2 w - - 0 1");
                const expMoves = [
                    new Move(bishop, new Square(1, 1), new Square(2, 2), [], null, null),
                    new Move(bishop, new Square(1, 1), new Square(3, 3), [], null, null),
                ];
                const actualMoves = GameHelper.getLegalMovesForBishop(boardState, new Square(1, 1));
                compareMoves(expMoves, actualMoves);
            });
        });

        describe("when an enemy piece is blocking its path", () => {
            it("returns only moves up to and capturing the enemy piece", () => {

                const boardState = BoardState.fromFEN("2K5/8/8/8/3q4/8/8/B4k2 w - - 0 1");
                const expMoves = [
                    new Move(bishop, new Square(1, 1), new Square(2, 2), [], null, null),
                    new Move(bishop, new Square(1, 1), new Square(3, 3), [], null, null),
                    new Move(bishop, new Square(1, 1), new Square(4, 4), [], ChessPiece.BLACK_QUEEN, null),
                ];
                const actualMoves = GameHelper.getLegalMovesForBishop(boardState, new Square(1, 1));
                compareMoves(expMoves, actualMoves);
            });
        });

        describe("when the move results in a double king check", () => {
            it("contains a move with two checking squares", () => {
                const boardState = BoardState.fromFEN("2K5/5R2/4P1N1/5B2/4P3/8/8/5k2 w - - 0 1");
                const expMoves = [
                    new Move(bishop, new Square(5, 6), new Square(4, 7), [new Square(7, 6)], null, null),
                    new Move(bishop, new Square(5, 6), new Square(3, 8), [new Square(7, 6), new Square(3, 8)], null, null),
                ];
                const actualMoves = GameHelper.getLegalMovesForBishop(boardState, new Square(5, 6));
                compareMoves(expMoves, actualMoves);
            });
        });
    });

    describe("#getLegalMovesForRook", () => {
        const rook = ChessPiece.WHITE_ROOK;
        describe("when the rook is unimpeded in the middle of the board", () => {
            it("returns all 14 moves", () => {
                const boardState = BoardState.fromFEN("5K1k/7p/8/8/3R4/8/8/8 w - - 0 1");
                const expMoves = [
                    new Move(rook, new Square(4, 4), new Square(4, 5), [], null, null),
                    new Move(rook, new Square(4, 4), new Square(4, 6), [], null, null),
                    new Move(rook, new Square(4, 4), new Square(4, 7), [], null, null),
                    new Move(rook, new Square(4, 4), new Square(4, 8), [], null, null),
                    new Move(rook, new Square(4, 4), new Square(4, 1), [], null, null),
                    new Move(rook, new Square(4, 4), new Square(4, 2), [], null, null),
                    new Move(rook, new Square(4, 4), new Square(4, 3), [], null, null),
                    new Move(rook, new Square(4, 4), new Square(1, 4), [], null, null),
                    new Move(rook, new Square(4, 4), new Square(2, 4), [], null, null),
                    new Move(rook, new Square(4, 4), new Square(3, 4), [], null, null),
                    new Move(rook, new Square(4, 4), new Square(5, 4), [], null, null),
                    new Move(rook, new Square(4, 4), new Square(6, 4), [], null, null),
                    new Move(rook, new Square(4, 4), new Square(7, 4), [], null, null),
                    new Move(rook, new Square(4, 4), new Square(8, 4), [], null, null),
                ];
                const actualMoves = GameHelper.getLegalMovesForRook(boardState, new Square(4, 4));
                compareMoves(expMoves, actualMoves);
            });
        });

        describe("when the rook is impeded by both friendly and enemy pieces", () => {
            it("does not return friendly captures and moves beyond other pieces", () => {
                const boardState = BoardState.fromFEN("R1N5/7p/q7/8/8/4K3/8/6k1 w - - 0 1");
                const expMoves = [
                    new Move(rook, new Square(8, 1), new Square(7, 1), [], null, null),
                    new Move(rook, new Square(8, 1), new Square(6, 1), [], ChessPiece.BLACK_QUEEN, null),
                    new Move(rook, new Square(8, 1), new Square(8, 2), [], null, null)
                ];
                const actualMoves = GameHelper.getLegalMovesForRook(boardState, new Square(8, 1));
                compareMoves(expMoves, actualMoves);
            });
        });

        describe("when the rook move results in a check", () => {
            it("returns a move with a checking square", () => {
                const boardState = BoardState.fromFEN("R1N5/Q6p/8/8/8/4K3/8/1k6 w - - 0 1");
                const expMoves = [
                    new Move(rook, new Square(8, 1), new Square(8, 2), [new Square(8, 2)], null, null),
                ];
                const actualMoves = GameHelper.getLegalMovesForRook(boardState, new Square(8, 1));
                compareMoves(expMoves, actualMoves);
            });
        });
    });

    describe("#getLegalMovesForQueen", () => {
        const queen = ChessPiece.WHITE_QUEEN;
        describe("when the queen is unimpeded in the middle of the board", () => {
            it("returns all possible queen moves", () => {
                const boardState = BoardState.fromFEN("kr6/pp6/5K2/8/2Q5/8/8/8 w - - 0 1");
                const expMoves = [
                    new Move(queen, new Square(4, 3), new Square(4, 2), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(4, 1), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(4, 4), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(4, 5), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(4, 6), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(4, 7), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(4, 8), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(1, 3), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(2, 3), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(3, 3), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(5, 3), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(6, 3), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(7, 3), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(8, 3), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(3, 2), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(2, 1), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(5, 4), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(6, 5), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(7, 6), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(8, 7), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(5, 2), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(6, 1), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(3, 4), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(2, 5), [], null, null),
                    new Move(queen, new Square(4, 3), new Square(1, 6), [], null, null),
                ];
                const actualMoves = GameHelper.getLegalMovesForQueen(boardState, new Square(4, 3));
                compareMoves(expMoves, actualMoves);
            });
        });
    });

    describe("#getLegalMovesForKing", () => {
        const king = ChessPiece.WHITE_KING;
        const black_king = ChessPiece.BLACK_KING;
        describe("when the king is unimpeded in the middle of the board", () => {
            it("returns all 8 moves", () => {
                const boardState = BoardState.fromFEN("k7/p7/5K2/8/8/8/8/8 w - - 0 1");
                const expMoves = [
                    new Move(king, new Square(6, 6), new Square(7, 5), [], null, null),
                    new Move(king, new Square(6, 6), new Square(7, 6), [], null, null),
                    new Move(king, new Square(6, 6), new Square(7, 7), [], null, null),
                    new Move(king, new Square(6, 6), new Square(6, 5), [], null, null),
                    new Move(king, new Square(6, 6), new Square(6, 7), [], null, null),
                    new Move(king, new Square(6, 6), new Square(5, 5), [], null, null),
                    new Move(king, new Square(6, 6), new Square(5, 6), [], null, null),
                    new Move(king, new Square(6, 6), new Square(5, 7), [], null, null),
                ];
                const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(6, 6));
                compareMoves(expMoves, actualMoves);
            });
        });

        describe("when the king is unimpeded on the corner of the board", () => {
            it("does not include moves out of the board space", () => {
                const boardState = BoardState.fromFEN("k7/p7/8/8/8/8/8/7K w - - 0 1");
                const expMoves = [
                    new Move(king, new Square(1, 8), new Square(1, 7), [], null, null),
                    new Move(king, new Square(1, 8), new Square(2, 7), [], null, null),
                    new Move(king, new Square(1, 8), new Square(2, 8), [], null, null),
                ];
                const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(1, 8));
                compareMoves(expMoves, actualMoves);
            });
        });

        describe("when the king is one square away from enemy king", () => {
            it("can not move adjacent to the enemy king", () => {
                const boardState = BoardState.fromFEN("8/p7/8/8/1k1K4/8/8/8 w - - 0 1");
                const expMoves = [
                    new Move(king, new Square(4, 4), new Square(5, 4), [], null, null),
                    new Move(king, new Square(4, 4), new Square(3, 4), [], null, null),
                    new Move(king, new Square(4, 4), new Square(5, 5), [], null, null),
                    new Move(king, new Square(4, 4), new Square(4, 5), [], null, null),
                    new Move(king, new Square(4, 4), new Square(3, 5), [], null, null),
                ];
                const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(4, 4));
                compareMoves(expMoves, actualMoves);
            });
        });
        describe("when the king is checkmated on the back rank by a defended queen", () => {
            it("returns no legal moves", () => {
                const boardState = BoardState.fromFEN("3K4/3q4/3k4/8/8/8/8/8 w - - 0 1");
                const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(8, 4));
                expect(actualMoves.length).toBe(0);
            });
        });

        describe("when the king has kingside castle rights", () => {
            describe("and a piece occupies a square between the king and kingside rook", () => {
                describe("and the king is white", () => {
                    it("does not return a move to castle kingside", () => {
                        const boardState = BoardState.fromFEN("4k3/p7/8/8/8/8/3PPP2/3QK1NR w K - 0 1");
                        const expMoves = [
                            new Move(king, new Square(1, 5), new Square(1, 6), [], null, null)
                        ];
                        const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(1, 5));
                        compareMoves(expMoves, actualMoves);
                    });
                });
                describe("and the king is black", () => {
                    it("does not return a move to castle kingside", () => {
                        const boardState = BoardState.fromFEN("3pkb1r/3ppp2/8/8/8/8/8/3K4 b k - 0 1");
                        const expMoves: Move[] = [];
                        const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(8, 5));
                        compareMoves(expMoves, actualMoves);
                    });
                });
            });
            describe("and all pieces are cleared between the king and kingside rook", () => {
                describe("and the king is white", () => {
                    it("returns a move to castle kingside", () => {
                        const boardState = BoardState.fromFEN("4k3/p7/8/8/8/5N2/3PPP2/3QK2R w K - 0 1");
                        const expMoves = [
                            new Move(king, new Square(1, 5), new Square(1, 6), [], null, null),
                            new Move(king, new Square(1, 5), new Square(1, 7), [], null, null),
                        ];
                        const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(1, 5));
                        compareMoves(expMoves, actualMoves);
                    });
                });
                describe("and the king is black", () => {
                    it("returns a move to castle kingside", () => {
                        const boardState = BoardState.fromFEN("3pk2r/3ppp2/3b4/8/8/8/8/3K4 b k - 0 1");
                        const expMoves = [
                            new Move(black_king, new Square(8, 5), new Square(8, 6), [], null, null),
                            new Move(black_king, new Square(8, 5), new Square(8, 7), [], null, null),
                        ];
                        const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(8, 5));
                        compareMoves(expMoves, actualMoves);
                    });
                });
                describe("and a square between castle squares is covered by an enemy rook", () => {
                    describe("and the king is white", () => {
                        it("does not return a move to castle kingside", () => {
                            const boardState = BoardState.fromFEN("4k1r1/p7/8/8/8/5N2/3PPP2/3QK2R w K - 0 1");
                            const expMoves = [
                                new Move(king, new Square(1, 5), new Square(1, 6), [], null, null),
                            ];
                            const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(1, 5));
                            compareMoves(expMoves, actualMoves);
                        });
                    });
                    describe("and the king is black", () => {
                        it("does not return a move to castle kingside", () => {
                            const boardState = BoardState.fromFEN("3pk2r/3pp1p1/3b4/8/8/8/8/3K1R2 b k - 0 1");
                            const expMoves: Move[] = [];
                            const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(8, 5));
                            compareMoves(expMoves, actualMoves);
                        });
                    });
                });
            });
        });

        describe("when the king has queenside castle rights", () => {
            describe("and a piece occupies a square between the king and kingside rook", () => {
                describe("and the king is white", () => {
                    it("does not return a move to castle queenside", () => {
                        const boardState = BoardState.fromFEN("4k3/8/2p5/8/8/8/3PPP2/R2QKB2 w Q - 0 1");
                        const expMoves: Move[] = [];
                        const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(1, 5));
                        compareMoves(expMoves, actualMoves);
                    });
                });
                describe("and the king is black", () => {
                    it("does not return a move to castle queenside", () => {
                        const boardState = BoardState.fromFEN("r2qkb2/3ppp2/8/8/8/8/3PPP2/R2QKB2 b q - 1 1");
                        const expMoves: Move[] = [];
                        const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(8, 5));
                        compareMoves(expMoves, actualMoves);
                    });
                });
            });
            describe("and all pieces are cleared between the king and queenside rook", () => {
                describe("and the king is white", () => {
                    it("returns a move to castle queenside", () => {
                        const boardState = BoardState.fromFEN("r2qkb2/3ppp2/8/8/8/8/3PPP2/R3KB2 w Qq - 1 1");
                        const expMoves: Move[] = [
                            new Move(king, new Square(1, 5), new Square(1, 3), [], null, null),
                            new Move(king, new Square(1, 5), new Square(1, 4), [], null, null)
                        ];
                        const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(1, 5));
                        compareMoves(expMoves, actualMoves);
                    });
                });
                describe("and the king is black", () => {
                    it("returns a move to castle queenside", () => {
                        const boardState = BoardState.fromFEN("r3kb2/3ppp2/8/8/8/8/3PPP2/R3KB2 b Qq - 1 1");
                        const expMoves: Move[] = [
                            new Move(black_king, new Square(8, 5), new Square(8, 3), [], null, null),
                            new Move(black_king, new Square(8, 5), new Square(8, 4), [], null, null)
                        ];
                        const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(8, 5));
                        compareMoves(expMoves, actualMoves);
                    });
                });
                describe("and a square between castle squares is covered by an enemy rook", () => {
                    describe("and the king is white", () => {
                        it("does not return a move to castle queenside", () => {
                            const boardState = BoardState.fromFEN("3rkb2/4pp2/8/8/8/8/4PP2/R3KB2 w Q - 1 1");
                            const expMoves: Move[] = [];
                            const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(1, 5));
                            compareMoves(expMoves, actualMoves);
                        });
                    });

                    describe("and the king is black", () => {
                        it("does not return a move to castle queenside", () => {
                            const boardState = BoardState.fromFEN("r3kb2/4pp2/8/8/8/8/4PP2/3RKB2 b q - 1 1");
                            const expMoves: Move[] = [];
                            const actualMoves = GameHelper.getLegalMovesForKing(boardState, new Square(8, 5));
                            compareMoves(expMoves, actualMoves);
                        });
                    });
                });
            });
        });

    });

    describe('#getPieceSquaresCheckingKing', () => {
        describe("when the board is the initial board", () => {
            it("returns an empty list", () => {
                const checkingSquares = GameHelper.getPieceSquaresCheckingKing(BoardState.getInitBoardState())
                expect(checkingSquares).toBeInstanceOf(Array)
                expect(checkingSquares).toHaveLength(0);
            });
        });
        describe("when there are multiple rooks on the board", () => {
            it("returns the square of each rook that is checking the king", () => {
                const fen = "3R2R1/8/2R5/2Rk2R1/4R3/2R5/R2R4/8 w - - 0 1";
                const boardState = BoardState.fromFEN(fen);
                const rookSquares = GameHelper.getPieceSquaresCheckingKing(boardState, false);
                expect(rookSquares).toBeInstanceOf(Array);
                expect(rookSquares).toHaveLength(4);
                const expRookSquares = [
                    new Square(2, 4),
                    new Square(8, 4),
                    new Square(5, 3),
                    new Square(5, 7)
                ];
                for (let rookSquare of rookSquares) {
                    let foundMatch = false;
                    for (let expRookSquare of expRookSquares) {
                        if (rookSquare.equalTo(expRookSquare)) {
                            foundMatch = true;
                            break;
                        }
                    }
                    expect(foundMatch).toBeTruthy();
                }
            });
        });
        describe("when there are multiple bishops on the board", () => {
            it("returns the square of each bishop that is giving a check", () => {
                const fen = "3BB2B/5B2/B2B1k1B/8/4BB1B/8/8/B7 w - - 0 1";
                const boardState = BoardState.fromFEN(fen);
                const bishopSquares = GameHelper.getPieceSquaresCheckingKing(boardState, false);
                expect(bishopSquares).toBeInstanceOf(Array);
                expect(bishopSquares).toHaveLength(4);
                const expBishopSquares = [
                    new Square(1, 1),
                    new Square(8, 8),
                    new Square(8, 4),
                    new Square(4, 8)
                ];
                for (let bishopSquare of bishopSquares) {
                    let foundMatch = false;
                    for (let expBishopSquare of expBishopSquares) {
                        if (bishopSquare.equalTo(expBishopSquare)) {
                            foundMatch = true;
                            break;
                        }
                    }
                    expect(foundMatch).toBeTruthy();
                }
            });
        });
        describe("when there are multiple pawns on the board", () => {
            describe("when the pawns are white", () => {
                it("returns the square of each pawn checking the king", () => {
                    const fen = "3PP2P/4PPP1/P2PPkPP/4PPP1/4PP1P/8/8/P7 w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const pawnSquares = GameHelper.getPieceSquaresCheckingKing(boardState, false);
                    expect(pawnSquares).toBeInstanceOf(Array);
                    expect(pawnSquares).toHaveLength(2);
                    const expPawnSquares = [
                        new Square(5, 5),
                        new Square(5, 7)
                    ];
                    for (let pawnSquare of pawnSquares) {
                        let foundMatch = false;
                        for (let expPawnSquare of expPawnSquares) {
                            if (pawnSquare.equalTo(expPawnSquare)) {
                                foundMatch = true;
                                break;
                            }
                        }
                        expect(foundMatch).toBeTruthy();
                    }
                });
            });

            describe("when the pawns are black", () => {
                it("returns the square of each pawn checking the king", () => {
                    const fen = "3pp2p/4ppp1/p2ppKpp/4ppp1/4pp1p/8/8/p7 w - - 0 1";
                    const boardState = BoardState.fromFEN(fen);
                    const pawnSquares = GameHelper.getPieceSquaresCheckingKing(boardState, true);
                    expect(pawnSquares).toBeInstanceOf(Array);
                    expect(pawnSquares).toHaveLength(2);
                    const expPawnSquares = [
                        new Square(7, 5),
                        new Square(7, 7)
                    ];
                    for (let pawnSquare of pawnSquares) {
                        let foundMatch = false;
                        for (let expPawnSquare of expPawnSquares) {
                            if (pawnSquare.equalTo(expPawnSquare)) {
                                foundMatch = true;
                                break;
                            }
                        }
                        expect(foundMatch).toBeTruthy();
                    }
                });
            });
        });
        describe("when there are multiple knights on the board", () => {
            it("returns the square of each knight that is giving a check", () => {
                const fen = "4NNN1/3NNNNN/2N2k1N/3N1N1N/4N1N1/8/8/5N2 w - - 0 1";
                const boardState = BoardState.fromFEN(fen);
                const knightSquares = GameHelper.getPieceSquaresCheckingKing(boardState, false);
                expect(knightSquares).toBeInstanceOf(Array);
                expect(knightSquares).toHaveLength(8);
                const expKnightSquares = [
                    new Square(4, 5),
                    new Square(4, 7),
                    new Square(5, 4),
                    new Square(5, 8),
                    new Square(7, 4),
                    new Square(7, 8),
                    new Square(8, 5),
                    new Square(8, 7)
                ];
                for (let knightSquare of knightSquares) {
                    let foundMatch = false;
                    for (let expKnightSquare of expKnightSquares) {
                        if (knightSquare.equalTo(expKnightSquare)) {
                            foundMatch = true;
                            break;
                        }
                    }
                    expect(foundMatch).toBeTruthy();
                }
            });
        });
        describe("when there are multiple queen on the board", () => {
            it("returns the square of each queen that is giving a check", () => {
                const fen = "3QQ1Q1/3Q1QQQ/Q4k1Q/3Q1QQQ/4Q1Q1/8/8/Q7 w - - 0 1";
                const boardState = BoardState.fromFEN(fen);
                const queenSquares = GameHelper.getPieceSquaresCheckingKing(boardState, false);
                expect(queenSquares).toBeInstanceOf(Array);
                expect(queenSquares).toHaveLength(8);
                const expQueenSquares = [
                    new Square(1, 1),
                    new Square(6, 1),
                    new Square(8, 4),
                    new Square(7, 6),
                    new Square(7, 7),
                    new Square(6, 8),
                    new Square(5, 7),
                    new Square(5, 6)
                ];
                for (let queenSquare of queenSquares) {
                    let foundMatch = false;
                    for (let expQueenSquare of expQueenSquares) {
                        if (queenSquare.equalTo(expQueenSquare)) {
                            foundMatch = true;
                            break;
                        }
                    }
                    expect(foundMatch).toBeTruthy();
                }
            });
        });
        describe("when only same color pieces as king exist", () => {
            it("returns no checking squares", () => {
                const fen = "3q4/4p3/2q2k2/4p3/3bn1n1/5r2/8/8 w - - 0 1";
                const boardState = BoardState.fromFEN(fen);
                const queenSquares = GameHelper.getPieceSquaresCheckingKing(boardState, false);
                expect(queenSquares).toBeInstanceOf(Array);
                expect(queenSquares).toHaveLength(0);
            });
        });
        describe("when all 'blockable' pieces are blocked", () => {
            it("returns no checking squares", () => {
                const fen = "3Q4/4n3/1Qq2kpR/6N1/7B/2N2N2/1B3R2/8 w - - 0 1";
                const boardState = BoardState.fromFEN(fen);
                const queenSquares = GameHelper.getPieceSquaresCheckingKing(boardState, false);
                expect(queenSquares).toBeInstanceOf(Array);
                expect(queenSquares).toHaveLength(0);

            });
        });
        describe("when two kings are adjacent", () => {
            it("returns the adjacent king square", () => {
                const board = BoardState.fromFEN("8/8/8/3kK3/8/8/8/8 w - - 0 1");
                const checkingSquares = GameHelper.getPieceSquaresCheckingKing(board, true);
                expect(checkingSquares.length).toBe(1);
                expect(checkingSquares[0].equalTo(new Square(5, 4))).toBeTruthy();
            });
        });
    });

    describe("#isForcedDraw", () => {
        describe("when remaining material forces a draw", () => {
            describe("and only the kings are on the board", () => {
                it("returns true", () => {
                    const boardState = BoardState.fromFEN("8/8/8/8/7K/8/8/k7 w - - 0 1");
                    expect(GameHelper.isForcedDraw(boardState.material)).toBeTruthy();
                });
            });
            describe("when only one bishop exists", () => {
                describe("and its a white bishop", () => {
                    it("returns true", () => {
                        const boardState = BoardState.fromFEN("8/4B3/8/8/7K/8/8/k7 w - - 0 1")
                        expect(GameHelper.isForcedDraw(boardState.material)).toBeTruthy();
                    });
                });
                describe("when its a black bishop", () => {
                    it("returns true", () => {
                        const boardState = BoardState.fromFEN("8/4b3/8/8/7K/8/8/k7 w - - 0 1")
                        expect(GameHelper.isForcedDraw(boardState.material)).toBeTruthy();
                    });
                });
            });
            describe("when both players have one bishop", () => {
                it("returns true", () => {
                    const boardState = BoardState.fromFEN("8/4B3/8/8/7K/8/3b4/k7 w - - 0 1");
                    expect(GameHelper.isForcedDraw(boardState.material)).toBeTruthy();
                });
            });
            describe("when a player has two same colored bishops", () => {
                describe("and the bishops are white", () => {
                    it("returns true", () => {
                        const boardState = BoardState.fromFEN("8/4B3/3B4/8/7K/8/8/k7 w - - 0 1");
                        expect(GameHelper.isForcedDraw(boardState.material)).toBeTruthy();
                    });
                });
                describe("when the bishops are black", () => {
                    it("returns true", () => {
                        const boardState = BoardState.fromFEN("8/5b2/4b3/8/7K/8/8/k7 w - - 0 1");
                        expect(GameHelper.isForcedDraw(boardState.material)).toBeTruthy();
                    });
                });
            });
            describe("when only one knight exists", () => {
                describe("and the knight is white", () => {
                    it("returns true", () => {
                        const boardState = BoardState.fromFEN("8/8/8/8/4N2K/8/8/k7 w - - 0 1");
                        expect(GameHelper.isForcedDraw(boardState.material)).toBeTruthy();
                    });
                });
                describe("and the knight is black", () => {
                    it("returns true", () => {
                        const boardState = BoardState.fromFEN("8/8/4n3/8/7K/8/8/k7 w - - 0 1");
                        expect(GameHelper.isForcedDraw(boardState.material)).toBeTruthy();
                    });
                });
            });
            describe("when both players have only one knight", () => {
                it("returns true", () => {
                    const boardState = BoardState.fromFEN("5n2/8/8/8/4N2K/8/8/k7 w - - 0 1");
                    expect(GameHelper.isForcedDraw(boardState.material)).toBeTruthy();
                });
            });
        });
        describe("when remaining material does not force a draw", () => {
            describe("when only one rook exists", () => {
                it("returns false", () => {
                    const boardState = BoardState.fromFEN("8/2R5/8/8/7K/8/8/k7 w - - 0 1");
                    expect(GameHelper.isForcedDraw(boardState.material)).toBeFalsy();
                });
            });
            describe("when only one queen exists", () => {
                it("returns false", () => {
                    const boardState = BoardState.fromFEN("8/8/4q3/8/7K/8/8/k7 w - - 0 1");
                    expect(GameHelper.isForcedDraw(boardState.material)).toBeFalsy();
                });
            });
            describe("when only one pawn exists", () => {
                it("returns false", () => {
                    const boardState = BoardState.fromFEN("8/8/8/6P1/7K/8/8/k7 w - - 0 1");
                    expect(GameHelper.isForcedDraw(boardState.material)).toBeFalsy();
                });
            });
            describe("when a player has two different colored bishops", () => {
                it("returns false", () => {
                    const boardState = BoardState.fromFEN("8/4B3/4B3/8/7K/8/8/k7 w - - 0 1");
                    expect(GameHelper.isForcedDraw(boardState.material)).toBeFalsy();
                });
            });
            describe("when only one player has a bishop and knight", () => {
                it("returns false", () => {
                    const boardState = BoardState.fromFEN("8/4B3/4N3/8/7K/8/8/k7 w - - 0 1");
                    expect(GameHelper.isForcedDraw(boardState.material)).toBeFalsy();
                });
            });
            describe("when only one player has two knights", () => {
                it("returns false", () => {
                    const boardState = BoardState.fromFEN("8/8/4n3/4n3/7K/8/8/k7 w - - 0 1");
                    expect(GameHelper.isForcedDraw(boardState.material)).toBeFalsy();
                });
            });
        });
    });
});


import {BoardState} from "../../../src/models/domain/board_state";
import {Board} from "../../../src/models/domain/board";
import {Square} from "../../../src/models/domain/square";
import {EasyQueue} from "../../../src/helpers/easy_queue";
import {Move} from "../../../src/models/domain/move";
import {ChessPiece} from "../../../src/models/domain/chess_piece";

describe("BoardState", () => {
    let boardState: BoardState;
    beforeEach(() => {
        boardState = BoardState.fromBoard(Board.getInitBoardState());
    });
    describe("::TileProps", () => {
        beforeEach(() => {
            boardState = new BoardState({
                isLocked: false,
                isWhitePerspective: true,
                board: Board.getInitBoardState(),
                selectedSquare: new Square(1, 1),
                squareColorBySquareHash: new Map(),
                selectedMoves: [],
                premoves: new EasyQueue(),
                draggingPiece: null,
            });
        });
        describe("board actions are locked", () => {
            beforeEach(() => {
                boardState.isLocked = true;
            });
            it("returns no interactable tiles", () => {
                const tileProps = boardState.tileProps(null);
                const containsInteractableTile = !!tileProps.find(tile => tile.isInteractable);
                expect(containsInteractableTile).toBeFalsy();
            });
        });
        describe("board actions are not locked", () => {
            beforeEach(() => {
                boardState.isLocked = false;
            });
            describe("last move is null", () => {
                it("returns no tile props with 'last move start/end' flag", () => {
                    const tileProps = boardState.tileProps(null);
                    const containsLastMoveStart = !!tileProps.find(tile => tile.isLastMoveStart);
                    const containsLastMoveEnd = !!tileProps.find(tile => tile.isLastMoveEnd);
                    expect(containsLastMoveStart).toBeFalsy();
                    expect(containsLastMoveEnd).toBeFalsy();
                });
            });
            describe("last move is not null", () => {
                let move: Move;
                beforeEach(() => {
                    move = new Move(ChessPiece.WHITE_PAWN, new Square(2, 4), new Square(4, 4), [], ChessPiece.EMPTY, ChessPiece.EMPTY);
                    boardState.board = Board.fromFEN("rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1");
                });
                it("returns a tile with the 'last move start' flag", () => {
                    const tileProps = boardState.tileProps(move);
                    const containsLastMoveStart = !!tileProps.find(tile => tile.isLastMoveStart);
                    expect(containsLastMoveStart).toBeTruthy();
                });
                it("returns a tile with the 'last move end' flag", () => {
                    const tileProps = boardState.tileProps(move);
                    const containsLastMoveEnd = !!tileProps.find(tile => tile.isLastMoveEnd);
                    expect(containsLastMoveEnd).toBeTruthy();
                });
            });
            describe("selected square is null", () => {
                beforeEach(() => {
                    boardState.selectedSquare = null;
                });
                it("returns no tiles with a 'selected' flag", () => {
                    const tileProps = boardState.tileProps(null);
                    const containsSelectedTile = !!tileProps.find(tile => tile.isSelected);
                    expect(containsSelectedTile).toBeFalsy();
                });
            });
            describe("selected square is not null", () => {
                beforeEach(() => {
                    boardState.selectedSquare = new Square(2, 4);
                });
                it("returns a tile with the 'selected' flag", () => {
                    const tileProps = boardState.tileProps(null);
                    const containsSelectedTile = !!tileProps.find(tile => tile.isSelected);
                    expect(containsSelectedTile).toBeTruthy();
                });
                describe("its the player's turn", () => {
                    it("returns interactable tiles that reflect only legal moves", () => {
                        const tileProps = boardState.tileProps(null);
                        const containsIllegalCapture = tileProps.find(tile => {
                            return tile.square.equalTo(new Square(3, 3)) && tile.isInteractable;
                        });
                        expect(containsIllegalCapture).toBeFalsy();
                        const containsLegalCapture = tileProps.find(tile => {
                            return tile.square.equalTo(new Square(4, 4)) && tile.isInteractable;
                        });
                        expect(containsLegalCapture).toBeTruthy();
                    });
                });
                describe("its not the player's turn", () => {
                    beforeEach(() => {
                        boardState.isWhitePerspective = false;
                        boardState.selectedSquare = new Square(7, 4);
                    });
                    it("returns interactable tiles that include all premoves", () => {
                        const tileProps = boardState.tileProps(null);
                        const containsPremove = tileProps.find(tile => {
                            return tile.square.equalTo(new Square(6, 3)) && tile.isInteractable;
                        });
                        expect(containsPremove).toBeTruthy();
                    });
                });
            });
        });
    });
    describe("::isTurn", () => {
        describe("white perspective", () => {
            describe("is white's turn", () => {
                beforeEach(() => {
                    boardState = BoardState.fromBoard(Board.fromFEN("3k4/8/8/8/8/6R1/8/5K2 w - - 0 1"));
                });
                it("returns true", () => {
                    expect(boardState.isTurn()).toBeTruthy();
                });
            });
            describe("is black's turn", () => {
                beforeEach(() => {
                    boardState = BoardState.fromBoard(Board.fromFEN("3k4/8/8/8/8/6R1/8/5K2 b - - 0 1"));
                });
                it("returns false", () => {
                    expect(boardState.isTurn()).toBeFalsy();
                });
            });
        });
        describe("black perspective", () => {
            beforeEach(() => {
                boardState.isWhitePerspective = false;
            });
            describe("is white's turn", () => {
                beforeEach(() => {
                    boardState.board = Board.fromFEN("3k4/8/8/8/8/6R1/8/5K2 w - - 0 1");
                });
                it("returns false", () => {
                    expect(boardState.isTurn()).toBeFalsy();
                });
            });
            describe("is black's turn", () => {
                beforeEach(() => {
                    boardState.board = Board.fromFEN("3k4/8/8/8/8/6R1/8/5K2 b - - 0 1");
                });
                it("returns true", () => {
                    expect(boardState.isTurn()).toBeTruthy();
                });
            });
        });
    });
    describe("::boardAndPremoveSquaresAfterPremoves", () => {
        describe("with no premoves", () => {
            it("returns the same board", () => {
                const [board] = boardState.boardAndPremoveSquareHashesAfterPremoves();
                expect(board.toFEN()).toEqual(boardState.board.toFEN());
                expect(board).toEqual(boardState.board);
            });
            it("returns no premove squares", () => {
                const [_, premoveSquareHashes] = boardState.boardAndPremoveSquareHashesAfterPremoves();
                expect(premoveSquareHashes.size).toEqual(0);
            });
        });
        describe("with premoves", () => {
            describe("when a premove is a promotion", () => {
                beforeEach(() => {
                    boardState = BoardState.fromBoard(Board.fromFEN("r7/6P1/1k6/8/8/8/8/6RK b - - 1 63"));
                    boardState.premoves = new EasyQueue(
                        new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_BISHOP),
                    );
                });
                it("sets the promoting pawn to the promotion piece", () => {
                    const [board] = boardState.boardAndPremoveSquareHashesAfterPremoves();
                    expect(board.getPieceBySquare(new Square(8, 7))).toEqual(ChessPiece.WHITE_BISHOP);
                });
                it("returns all premove squares", () => {
                    const [_, premoveSquareHashes] = boardState.boardAndPremoveSquareHashesAfterPremoves();
                    const expPremoveSquareHashes = new Set([
                        new Square(7, 7).hash(),
                        new Square(8, 7).hash(),
                    ]);
                    expect(premoveSquareHashes.size).toEqual(expPremoveSquareHashes.size);
                    for (const premoveSquareHash of premoveSquareHashes) {
                        expect(expPremoveSquareHashes).toContain(premoveSquareHash);
                    }
                });
            });
            describe("when no premoves are promotions", () => {
                beforeEach(() => {
                    boardState.premoves = new EasyQueue(
                        new Move(ChessPiece.WHITE_PAWN, new Square(2, 2), new Square(4, 2), [], ChessPiece.EMPTY, ChessPiece.EMPTY),
                        new Move(ChessPiece.WHITE_PAWN, new Square(4, 2), new Square(5, 2), [], ChessPiece.EMPTY, ChessPiece.EMPTY),
                        new Move(ChessPiece.WHITE_PAWN, new Square(5, 2), new Square(6, 2), [], ChessPiece.EMPTY, ChessPiece.EMPTY),
                    );
                });
                it("returns the board after premoves", () => {
                    const [board] = boardState.boardAndPremoveSquareHashesAfterPremoves();
                    const expectedBoardFEN = "rnbqkbnr/pppppppp/1P6/8/8/8/P1PPPPPP/RNBQKBNR w KQkq - 0 1";
                    expect(board.toFEN()).toEqual(expectedBoardFEN);
                });
                it("returns all expected premove squares", () => {
                    const [_, premoveSquareHashes] = boardState.boardAndPremoveSquareHashesAfterPremoves();
                    const expPremoveSquareHashes = new Set([
                        new Square(2, 2).hash(),
                        new Square(4, 2).hash(),
                        new Square(5, 2).hash(),
                        new Square(6, 2).hash(),
                    ]);
                    expect(premoveSquareHashes.size).toEqual(expPremoveSquareHashes.size);
                    for (const premoveSquareHash of premoveSquareHashes) {
                        expect(expPremoveSquareHashes).toContain(premoveSquareHash);
                    }
                });
            });
        });
    });
});
import {BoardState} from "../../src/models/domain/board_state";
import {Square} from "../../src/models/domain/square";

describe("BoardState", () => {
    describe("#fromFEN", () => {
        describe("when the FEN represents the starting board state", () => {
            it("returns an init board state", () => {
                const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
                const initBoardState = BoardState.getInitBoardState();
                const fenBoardState = BoardState.fromFEN(fen)
                expect(fenBoardState.equalTo(initBoardState)).toBeTruthy();
            });
        })

        describe("when the FEN specifies neither player has castling rights", () => {
            it("returns a board state accordingly", () => {
                const fen = "3R2R1/8/2R5/2Rk2R1/4R3/2R5/R2R4/8 w - - 0 1";
                const boardState = BoardState.fromFEN(fen);
                expect(boardState.canWhiteCastleKingside).toBeFalsy();
                expect(boardState.canWhiteCastleQueenside).toBeFalsy();
                expect(boardState.canBlackCastleKingside).toBeFalsy();
                expect(boardState.canBlackCastleQueenside).toBeFalsy();
            });
        });
    });

    describe("::toFEN", () => {
        describe("when the board is the initial board state", () => {
            it("returns the FEN for an initial board state", () => {
                const expFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
                const initBoardState = BoardState.getInitBoardState();
                const actualFEN = initBoardState.toFEN();
                expect(expFEN).toBe(actualFEN);
            });
        });

        describe("when neither player has castle rights", () => {
            it("returns a FEN with a dash as the castle rights segment", () => {
                const expFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";
                const initBoardState = BoardState.getInitBoardState();
                initBoardState.canWhiteCastleKingside = false;
                initBoardState.canWhiteCastleQueenside = false;
                initBoardState.canBlackCastleKingside = false;
                initBoardState.canBlackCastleQueenside = false;
                const actualFEN = initBoardState.toFEN();
                expect(expFEN).toBe(actualFEN);
            });
        });
    });

    describe("::equalTo", () => {
       describe("when the two instances being compared have identical data on each field", () => {
           it("returns true", () => {
               const boardStateA = BoardState.getInitBoardState();
               const boardStateB = BoardState.getInitBoardState();
               expect(boardStateA.equalTo(boardStateB)).toBeTruthy();
           });
       });

       describe("when the two instances being compared differ", () => {
           it("returns false", () => {
               const boardStateA = BoardState.getInitBoardState();
               const boardStateB = BoardState.getInitBoardState();
               boardStateB.enPassantSquare = new Square(3, 2);
               expect(boardStateA.equalTo(boardStateB)).toBeFalsy();
           });
       });

       describe("when the two instances differ by their enPassantSquare field", () => {
           it("returns false", () => {
               const boardStateA = BoardState.getInitBoardState();
               const boardStateB = BoardState.getInitBoardState();
               boardStateB.enPassantSquare = new Square(9, 9);
               expect(boardStateA.equalTo(boardStateB)).toBeFalsy();
           })
       });
    });

    describe("::getHasLegalMoves", () => {
        describe("when the board is in a stalemate state", () => {
            it("returns false", () => {
                const fen = "4K3/8/3r1q2/8/8/8/1k6/8 w - - 0 1";
                const board = BoardState.fromFEN(fen);
                const hasLegalMoves = board.getHasLegalMoves();
                expect(hasLegalMoves).toBeFalsy();
            });
        });
        describe("when the board is in a playable state", () => {
            it("returns true", () => {
               const board = BoardState.getInitBoardState();
               const hasLegalMoves = board.getHasLegalMoves();
               expect(hasLegalMoves).toBeTruthy();
            });
        });
        describe("when the board is in a checkmate state", () => {
            it("returns false", () => {
                const board = BoardState.fromFEN("3K4/3q4/3k4/8/8/8/8/8 w - - 0 1");
                const hasLegalMoves = board.getHasLegalMoves();
                expect(hasLegalMoves).toBeFalsy();
            });
        });
    });
});
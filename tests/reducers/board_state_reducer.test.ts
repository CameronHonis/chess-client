import {UpdateBoardAction} from "../../src/models/actions/board/update_board";
import {Board} from "../../src/models/domain/board";
import {BoardState} from "../../src/models/domain/board_state";
import {Square} from "../../src/models/domain/square";
import {boardStateReducer} from "../../src/reducers/board_state_reducer";
import {SquareColor} from "../../src/models/domain/square_color";
import {Move} from "../../src/models/domain/move";
import {ChessPiece} from "../../src/models/domain/chess_piece";
import {EasyQueue} from "../../src/helpers/easy_queue";
import {LeftClickSquareAction} from "../../src/models/actions/board/left_click_square";
import {PickPromoteAction} from "../../src/models/actions/board/pick_move";
import {RightClickSquareAction} from "../../src/models/actions/board/right_click_square";
import {LeftDraggingStartAction} from "../../src/models/actions/board/left_dragging_start_action";
import {LeftDraggingStopAction} from "../../src/models/actions/board/left_dragging_stop_action";

describe("boardStateReducer", () => {
    let state: BoardState;
    beforeEach(() => {
        state = BoardState.fromBoard(Board.getInitBoardState());
    });
    describe("on UPDATE_BOARD", () => {
        let action: UpdateBoardAction;
        beforeEach(() => {
            action = new UpdateBoardAction(Board.fromFEN("rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1"));
        });
        it("returns a new board state with the new board", () => {
            const newState = boardStateReducer(state, action);
            expect(newState.board).toEqual(action.payload.newBoard);
        });
        describe("the selected square is set", () => {
            describe("the selected square gets captured", () => {
                beforeEach(() => {
                    state = BoardState.fromBoard(Board.fromFEN("rnbqkb1r/ppp1pppp/5n2/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 1"));
                    state.selectedSquare = new Square(5, 4);
                    action = new UpdateBoardAction(Board.fromFEN("rnbqkb1r/ppp1pppp/5n2/3P4/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 1"));
                });
                it("sets the selected square to null", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.selectedSquare).toBeNull();
                });
            });
            describe("the selected square does not get captured", () => {
                beforeEach(() => {
                    state.selectedSquare = new Square(7, 4);
                });
                it("does not change the selected square", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.selectedSquare).toEqual(state.selectedSquare);
                });
            });
        });
        describe("a square is marked", () => {
            let square: Square;
            beforeEach(() => {
                square = new Square(3, 3);
                state.setSquareColor(square, SquareColor.GREEN);
            });
            it("resets the square color", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.getSquareColor(new Square(3, 3))).toBeUndefined();
            });
        });
        describe("selected moves are set", () => {
            // NOTE: When in promotion menu for a premove, and the opponent moves
            beforeEach(() => {
                state = BoardState.fromBoard(Board.fromFEN("8/6P1/8/8/8/1n6/1k6/7K b - - 0 1"));
                state.selectedMoves = [
                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_QUEEN),
                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_ROOK),
                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_BISHOP),
                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_KNIGHT),
                ];
                action = new UpdateBoardAction(Board.fromFEN("8/6P1/8/2n5/8/8/1k6/7K w - - 0 1"));
            });
            it("resets the selected moves", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.selectedMoves).toHaveLength(0);
            });
        });
        describe("premoves are queued", () => {
            beforeEach(() => {
                state = BoardState.fromBoard(Board.fromFEN("1kr5/6P1/8/8/8/8/8/6RK b - - 1 63"));
                state.premoves = new EasyQueue(
                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 6), [], ChessPiece.EMPTY, ChessPiece.WHITE_ROOK),
                    new Move(ChessPiece.WHITE_ROOK, new Square(1, 7), new Square(1, 1), [], ChessPiece.EMPTY, ChessPiece.EMPTY),
                );
            });
            describe("the next premove is legal", () => {
                beforeEach(() => {
                    action = new UpdateBoardAction(Board.fromFEN("1k3r2/6P1/8/8/8/8/8/6RK w - - 1 63"));
                });
                it("sets the premove as the selected move", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.selectedMoves).toHaveLength(1);
                });
                it("sets the king checks on the selected move", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.selectedMoves[0].kingCheckingSquares).toHaveLength(1);
                    expect(newState.selectedMoves[0].kingCheckingSquares[0].equalTo(new Square(8, 6))).toBeTruthy();
                });
                it("sets the piece captured on the selected move", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.selectedMoves[0].capturedPiece).toEqual(ChessPiece.BLACK_ROOK);
                });
                it("preserves the data on the premove", () => {
                    const newState = boardStateReducer(state, action);
                    const move = newState.selectedMoves[0];
                    expect(move).not.toBeNull();
                    expect(move.piece).toEqual(ChessPiece.WHITE_PAWN);
                    expect(move.startSquare.equalTo(new Square(7 ,7))).toBeTruthy();
                    expect(move.endSquare.equalTo(new Square(8, 6))).toBeTruthy();
                    expect(move.pawnUpgradedTo).toEqual(ChessPiece.WHITE_ROOK);
                });
                it("pops the first premove out of the premoves queue", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.premoves.size()).toEqual(1);
                    expect(newState.premoves.first().piece).toEqual(ChessPiece.WHITE_ROOK);
                });
            });
            describe("the next premove is illegal", () => {
                beforeEach(() => {
                    action = new UpdateBoardAction(Board.fromFEN("1k4r1/6P1/8/8/8/8/8/6RK w - - 1 63"));
                });
                it("flushes the premoves queue", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.premoves.size()).toEqual(0);
                });
            });
        });
    });

    describe("on LEFT_CLICK_SQUARE", () => {
        let action: LeftClickSquareAction;
        describe("there is no square selected", () => {
            describe("an enemy piece square is clicked", () => {
                beforeEach(() => {
                    action = new LeftClickSquareAction(new Square(8, 5));
                });
                it("does nothing", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.equalTo(state)).toBeTruthy();
                });
            });
            describe("an empty square is clicked", () => {
                beforeEach(() => {
                    action = new LeftClickSquareAction(new Square(5, 5));
                });
                it("does nothing", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.equalTo(state)).toBeTruthy();
                });
            });
            describe("a friendly piece square is clicked", () => {
                beforeEach(() => {
                    action = new LeftClickSquareAction(new Square(1, 1));
                });
                it("selects the square", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.selectedSquare).not.toBeNull();
                });
            });
            describe("a promotion premove is queued", () => {
                beforeEach(() => {
                    state = BoardState.fromBoard(Board.fromFEN("r7/6P1/1k6/8/8/8/8/6RK b - - 1 63"));
                    state.premoves = new EasyQueue(
                        new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_QUEEN),
                    );
                });
                describe("the square the promotion happened is clicked", () => {
                    beforeEach(() => {
                        action = new LeftClickSquareAction(new Square(8, 7));
                    });
                    it("sets the selected square to this square", () => {
                        const newState = boardStateReducer(state, action);
                        expect(newState.selectedSquare!.equalTo(new Square(8, 7))).toBeTruthy();
                    });
                });
                describe("the square the pawn was last on is clicked", () => {
                    beforeEach(() => {
                        action = new LeftClickSquareAction(new Square(7, 7));
                    });
                    it("does nothing", () => {
                        const newState = boardStateReducer(state, action);
                        expect(newState.selectedSquare).toBeNull();
                    });
                });
            });
        });
        describe("there is a square selected", () => {
            describe("it is the player's turn", () => {
                beforeEach(() => {
                    state.selectedSquare = new Square(2, 4);
                });
                describe("the selected square is clicked", () => {
                    beforeEach(() => {
                        action = new LeftClickSquareAction(new Square(2, 4));
                    });
                    it("deselects the selected square", () => {
                        const newState = boardStateReducer(state, action);
                        expect(newState.selectedSquare).toBeNull();
                    });
                });
                describe("a 'land-able' square is clicked", () => {
                    describe("the move is not a promotion", () => {
                        beforeEach(() => {
                            action = new LeftClickSquareAction(new Square(4, 4));
                        });
                        it("sets the selected move", () => {
                            const newState = boardStateReducer(state, action);
                            expect(newState.selectedMoves).toHaveLength(1);
                            const expMove = new Move(ChessPiece.WHITE_PAWN,
                                state.selectedSquare!,
                                action.payload.square,
                                [],
                                ChessPiece.EMPTY,
                                ChessPiece.EMPTY);
                            expect(newState.selectedMoves[0].equalTo(expMove)).toBeTruthy();
                        });
                    });
                    describe("the move is a promotion", () => {
                        beforeEach(() => {
                            state = BoardState.fromBoard(Board.fromFEN("8/2k3P1/8/8/8/8/4K3/8 w - - 0 1"));
                            state.selectedSquare = new Square(7, 7);
                            action = new LeftClickSquareAction(new Square(8, 7));
                        });
                        it("sets the selected moves", () => {
                            const newState = boardStateReducer(state, action);
                            expect(newState.selectedMoves).toHaveLength(4);
                            const allArePromotions = !newState.selectedMoves.some(move => {
                                return move.pawnUpgradedTo === ChessPiece.EMPTY;
                            });
                            expect(allArePromotions).toBeTruthy();
                            expect(newState.selectedMoves[0].startSquare).toEqual(state.selectedSquare);
                            expect(newState.selectedMoves[0].endSquare).toEqual(action.payload.square);
                        });
                    });
                });
                describe("a 'non-land-able' square is clicked", () => {
                    describe("the square is friendly", () => {
                        beforeEach(() => {
                            action = new LeftClickSquareAction(new Square(2, 2));
                        });
                        it("selects the square", () => {
                            const newState = boardStateReducer(state, action);
                            expect(newState.selectedSquare).toEqual(action.payload.square);
                        });
                    });
                    describe("the square is not friendly", () => {
                        beforeEach(() => {
                            action = new LeftClickSquareAction(new Square(6, 1));
                        });
                        it("deselects the selected square", () => {
                            const newState = boardStateReducer(state, action);
                            expect(newState.selectedSquare).toBeNull();
                        });
                    });
                });
            });
            describe("it is not the player's turn", () => {
                beforeEach(() => {
                    state.isWhitePerspective = false;
                });
                describe("a square is selected", () => {
                    beforeEach(() => {
                        state.selectedSquare = new Square(7, 4);
                    });
                    describe("a 'land-able' square is clicked", () => {
                        describe("the land square is a friendly piece", () => {
                            beforeEach(() => {
                                state = BoardState.fromBoard(Board.fromFEN("r7/6P1/1k6/8/8/8/8/6RK b - - 1 63"));
                                state.selectedSquare = new Square(1, 7);
                                action = new LeftClickSquareAction(new Square(7, 7));
                            });
                            it("pushes a premove that captures the friendly piece", () => {
                                const newState = boardStateReducer(state, action);
                                expect(newState.premoves.size()).toEqual(1);
                                expect(newState.premoves.first().piece).toEqual(ChessPiece.WHITE_ROOK);
                                expect(newState.premoves.first().startSquare.equalTo(new Square(1, 7))).toBeTruthy();
                                expect(newState.premoves.first().endSquare.equalTo(new Square(7, 7))).toBeTruthy();
                                expect(newState.premoves.first().pawnUpgradedTo).toEqual(ChessPiece.EMPTY);
                            });
                        });
                        describe("the move is not a promotion", () => {
                            beforeEach(() => {
                                action = new LeftClickSquareAction(new Square(5, 4));
                            });
                            it("adds the premove", () => {
                                const newState = boardStateReducer(state, action);
                                expect(newState.premoves.size()).toEqual(1);
                                const expMove = new Move(ChessPiece.BLACK_PAWN, new Square(7, 4), new Square(5, 4), [], ChessPiece.EMPTY, ChessPiece.EMPTY);
                                expect(newState.premoves.first().equalTo(expMove)).toBeTruthy();
                            });
                            it("deselects the selected square", () => {
                                const newState = boardStateReducer(state, action);
                                expect(newState.selectedSquare).toBeNull();
                            });
                        });
                        describe("the move is a promotion", () => {
                            beforeEach(() => {
                                state = BoardState.fromBoard(Board.fromFEN("8/2k3P1/8/8/8/8/4K3/8 b - - 0 1"));
                                state.selectedSquare = new Square(7, 7);
                                action = new LeftClickSquareAction(new Square(8, 7))
                            });
                            it("adds the moves to the selectedSquares", () => {
                                const newState = boardStateReducer(state, action);
                                expect(newState.selectedMoves).toHaveLength(4);
                                const allPromotions = !newState.selectedMoves.some(move => {
                                    return move.pawnUpgradedTo === ChessPiece.EMPTY;
                                });
                                expect(allPromotions).toBeTruthy();
                                expect(newState.selectedMoves[0].startSquare.equalTo(state.selectedSquare!)).toBeTruthy();
                                expect(newState.selectedMoves[0].endSquare.equalTo(action.payload.square)).toBeTruthy();
                            });
                            it("does not deselect the selected square", () => {
                                const newState = boardStateReducer(state, action);
                                expect(newState.selectedSquare).not.toBeNull();
                            });
                        });
                    });
                    describe("a 'non-land-able' square is clicked", () => {
                        beforeEach(() => {
                            state = BoardState.fromBoard(Board.fromFEN("r7/6P1/1k6/8/8/8/8/6RK b - - 1 63"));
                            state.selectedSquare = new Square(7, 7);
                        });
                        describe("a friendly piece is clicked", () => {
                            beforeEach(() => {
                                action = new LeftClickSquareAction(new Square(1, 7));
                            });
                            it("sets the selected square to the clicked square", () => {
                                const newState = boardStateReducer(state, action);
                                expect(newState.selectedSquare!.equalTo(action.payload.square)).toBeTruthy();
                            });
                        });
                        describe("an empty square is clicked", () => {
                            beforeEach(() => {
                                state.selectedMoves = [
                                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_BISHOP),
                                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_ROOK),
                                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_KNIGHT),
                                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_QUEEN),
                                ];
                                action = new LeftClickSquareAction(new Square(5, 5));
                            });
                            it("deselects the selected square", () => {
                                const newState = boardStateReducer(state, action);
                                expect(newState.selectedSquare).toBeNull();
                            });
                            it("deselects all selected moves", () => {
                                const newState = boardStateReducer(state, action);
                                expect(newState.selectedMoves).toHaveLength(0);
                            });
                        });
                    });
                });
            });
        });
    });

    describe("on LEFT_DRAGGING_START", () => {
        let action: LeftDraggingStartAction;
        describe("a square is selected", () => {
            describe("the dragging square is a friendly piece", () => {
                beforeEach(() => {
                    state.selectedSquare = new Square(2, 4);
                });
                describe("the dragging square is the selected square", () => {
                    beforeEach(() => {
                        action = new LeftDraggingStartAction(new Square(2, 4));
                    });
                    it("does not deselect the square", () => {
                        const newState = boardStateReducer(state, action);
                        expect(newState.selectedSquare).not.toBeNull();
                    });
                    it("sets the dragging anim piece", () => {
                        const newState = boardStateReducer(state, action);
                        expect(newState.draggingPiece).toEqual(ChessPiece.WHITE_PAWN);
                    });
                });
                describe("the dragging square is not the selected square", () => {
                    beforeEach(() => {
                        action = new LeftDraggingStartAction(new Square(2, 5));
                    });
                    it("selects the dragging square as the selected square", () => {
                        const newState = boardStateReducer(state, action);
                        expect(newState.selectedSquare!.equalTo(action.payload.square)).toBeTruthy();
                    });
                    it("removes all selected moves", () => {
                        const newState = boardStateReducer(state, action);
                        expect(newState.selectedMoves).toHaveLength(0);
                    });
                    it("sets the dragging anim piece", () => {
                        const newState = boardStateReducer(state, action);
                        expect(newState.draggingPiece).toEqual(ChessPiece.WHITE_PAWN);
                    });
                });
            });
            describe("the dragging square is not a friendly piece", () => {
                beforeEach(() => {
                    action = new LeftDraggingStartAction(new Square(7, 7));
                });
                it("deselects the selected square", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.selectedSquare).toBeNull();
                });
                it("does not set the dragging anim piece", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.draggingPiece).toBeNull();
                });
            });
        });
        describe("a square is not selected", () => {
            beforeEach(() => {
                state.selectedSquare = null;
            });
            describe("the dragging square is a friendly square", () => {
                beforeEach(() => {
                    action = new LeftDraggingStartAction(new Square(2, 4));
                });
                it("sets the selected square to the dragging square", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.selectedSquare!.equalTo(action.payload.square)).toBeTruthy();
                });
                it("sets the dragging anim piece", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.draggingPiece).toEqual(ChessPiece.WHITE_PAWN);
                });
            });
            describe("the dragging square is not a friendly square", () => {
                beforeEach(() => {
                   action = new LeftDraggingStartAction(new Square(5, 5));
                });
                it("does not select the dragging square", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.selectedSquare).toBeNull();
                });
                it("does not set the dragging anim piece", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.draggingPiece).toBeNull();
                });
            });
        });
    });

    describe("on LEFT_DRAGGING_STOP", () => {
        let action: LeftDraggingStopAction;
        beforeEach(() => {
            state.selectedSquare = new Square(2, 4);
        });
        describe("the drop square is null", () => {
            beforeEach(() => {
                action = new LeftDraggingStopAction(null);
            });
            it("deselects the selected square", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.selectedSquare).toBeNull();
            });
            it("does not set a selected move", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.selectedMoves).toHaveLength(0);
            });
            it("sets the dragging piece to null", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.draggingPiece).toBeNull();
            });
        });
        describe("the drop square is the selected square", () => {
            beforeEach(() => {
                action = new LeftDraggingStopAction(new Square(2, 4));
            });
            it("deselects the selected square", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.selectedSquare).toBeNull();
            });
            it("does not set a selected move", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.selectedMoves).toHaveLength(0);
            });
            it("sets the dragging piece to null", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.draggingPiece).toBeNull();
            });
        });
        describe("the drop square is on a land-able square", () => {
            beforeEach(() => {
                action = new LeftDraggingStopAction(new Square(4, 4));
            });
            it("deselects the selected square", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.selectedSquare).toBeNull();
            });
            it("sets the selected move", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.selectedMoves).toHaveLength(1);
                expect(newState.selectedMoves[0].piece).toEqual(ChessPiece.WHITE_PAWN);
                expect(newState.selectedMoves[0].startSquare.equalTo(new Square(2, 4))).toBeTruthy();
                expect(newState.selectedMoves[0].endSquare.equalTo(new Square(4, 4))).toBeTruthy();
                expect(newState.selectedMoves[0].pawnUpgradedTo).toEqual(ChessPiece.EMPTY);
            });
            it("sets the dragging piece to null", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.draggingPiece).toBeNull();
            });
        });
        describe("the drop square is not on a land-able square", () => {
            describe("the drop square is not a friendly piece square", () => {
                beforeEach(() => {
                    action = new LeftDraggingStopAction(new Square(8, 8));
                });
                it("deselects the selected square", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.selectedSquare).toBeNull();
                });
                it("does not set a selected move", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.selectedMoves).toHaveLength(0);
                });
                it("sets the dragging piece to null", () => {
                    const newState = boardStateReducer(state, action);
                    expect(newState.draggingPiece).toBeNull();
                });
            });
        });
    });

    describe("on RIGHT_CLICK_SQUARE", () => {
        let action: RightClickSquareAction;
        describe("premoves are queued", () => {
            beforeEach(() => {
                state.isWhitePerspective = false;
                state.premoves = new EasyQueue(
                    new Move(ChessPiece.BLACK_PAWN, new Square(7, 4), new Square(5, 4), [], ChessPiece.EMPTY, ChessPiece.EMPTY),
                );
                action = new RightClickSquareAction(new Square(4, 4));
            });
            it("clears premoves", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.premoves.size()).toEqual(0);
            });
        });
        describe("a square is selected", () => {
            beforeEach(() => {
                state.selectedSquare = new Square(1, 1);
                action = new RightClickSquareAction(new Square(4, 4));
            });
            it("deselects the selected square", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.selectedSquare).toBeNull();
            });
        });
    });

    describe("on PICK_PROMOTE", () => {
        let action: PickPromoteAction;
        describe("it's the player's turn", () => {
            beforeEach(() => {
                state = BoardState.fromBoard(Board.fromFEN("8/2k3P1/8/8/8/8/4K3/8 w - - 0 1"));
                state.selectedMoves = [
                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_KNIGHT),
                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_BISHOP),
                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_ROOK),
                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_QUEEN),
                ];
                action = new PickPromoteAction(ChessPiece.WHITE_ROOK);
            });
            it("sets the move as the selected move", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.selectedMoves).toHaveLength(1);
                expect(newState.selectedMoves[0].piece).toEqual(ChessPiece.WHITE_PAWN);
                expect(newState.selectedMoves[0].pawnUpgradedTo).toEqual(ChessPiece.WHITE_ROOK);
                expect(newState.selectedMoves[0].startSquare.equalTo(new Square(7, 7))).toBeTruthy();
                expect(newState.selectedMoves[0].endSquare.equalTo(new Square(8, 7))).toBeTruthy();
            });
        });
        describe("it's not the player's turn", () => {
            beforeEach(() => {
                state = BoardState.fromBoard(Board.fromFEN("8/2k3P1/8/8/8/8/4K3/8 b - - 0 1"));
                state.selectedSquare = new Square(7, 7);
                state.selectedMoves = [
                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_KNIGHT),
                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_BISHOP),
                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_ROOK),
                    new Move(ChessPiece.WHITE_PAWN, new Square(7, 7), new Square(8, 7), [], ChessPiece.EMPTY, ChessPiece.WHITE_QUEEN),
                ];
                state.isWhitePerspective = true;
                action = new PickPromoteAction(ChessPiece.WHITE_KNIGHT);
            });
            it("deselects all selected moves", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.selectedMoves).toHaveLength(0);
            });
            it("pops the move onto the premoves", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.premoves.size()).toEqual(1);
                expect(newState.premoves.first().piece).toEqual(ChessPiece.WHITE_PAWN);
                expect(newState.premoves.first().pawnUpgradedTo).toEqual(ChessPiece.WHITE_KNIGHT);
                expect(newState.premoves.first().startSquare.equalTo(new Square(7, 7))).toBeTruthy();
                expect(newState.premoves.first().endSquare.equalTo(new Square(8, 7))).toBeTruthy();
            });
            it("deselects the selected square", () => {
                const newState = boardStateReducer(state, action);
                expect(newState.selectedSquare).toBeNull();
            });
        });
    });

    describe("on CANCEL_PROMOTE", () => {

    });
});
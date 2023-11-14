import React from "react"
import {Match} from "../models/match";
import "../styles/summary.css";
import {ReturnedHome} from "../models/actions/returned_home";
import {appStateContext} from "../App";

export interface SummaryProps {
}

export const Summary: React.FC<SummaryProps> = (props) => {
    const [appState, appDispatch] = React.useContext(appStateContext);

    const match = appState.match!;
    const board = match.board;
    const whiteTimeRemaining = match.whiteTimeRemaining;
    const blackTimeRemaining = match.blackTimeRemaining;
    const [outcomeDesc, outcomeExpl] = React.useMemo(() => {
        if (board.isWhiteWinner === board.isBlackWinner) {
            if (board.halfMoveClockCount >= 50) {
                return ["Draw", "by 50-move rule"];
            } else if (!board.getHasLegalMoves()) {
                return ["Draw", "by stalemate"];
            } else if (!board.isDrawByRepetition()) {
                return ["Draw", "by repetition"];
            } else {
                return ["Draw", "by agreement"];
            }
        } else {
            const colorName = board.isWhiteWinner ? "White" : "Black";
            if (!board.getHasLegalMoves()) {
                return [`${colorName} wins`, "by checkmate"];
            } else if (whiteTimeRemaining < .0001 || blackTimeRemaining < .0001) {
                return [`${colorName} wins`, "by timeout"];
            } else {
                return [`${colorName} wins`, "by resignation"];
            }
        }
    }, [board, whiteTimeRemaining, blackTimeRemaining]);

    const handleHomeClick = () => {
        appDispatch(new ReturnedHome());
    }

    const handleRematchClick = () => {

    }

    return <div className={"SummaryFrame"}>
        <div className={"Summary"}>
            <div className={"Summary-Banner"}>
                <p>{outcomeDesc}</p>
            </div>
            <div className={"Summary-Body"}>
                <p>{outcomeExpl}</p>
                <div className={"Summary-Buttons"}>
                    <button onClick={handleHomeClick}>Home</button>
                    <button onClick={handleRematchClick}>Rematch</button>
                </div>
            </div>
        </div>
    </div>
}
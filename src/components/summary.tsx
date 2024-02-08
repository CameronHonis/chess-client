import React from "react"
import {ApiMatchSchema} from "../models/api/match";
import "../styles/summary.css";
import {ReturnHomeAction} from "../models/actions/return_home_action";
import {appStateContext} from "../App";

export interface SummaryProps {
}

export const Summary: React.FC<SummaryProps> = (props) => {
    const [appState, appDispatch] = React.useContext(appStateContext);
    const [isVisible, setIsVisible] = React.useState(true);

    const match = appState.match!;
    const board = match.board;
    const whiteTimeRemaining = match.whiteTimeRemainingSec;
    const blackTimeRemaining = match.blackTimeRemainingSec;
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
        appDispatch(new ReturnHomeAction());
    }

    const handleRematchClick = () => {
        if (!appState.match)
            throw new Error("Match is not defined in appState");
        if (!appState.auth)
            throw new Error("Auth is not defined in appState");
        const wasWhite = appState.auth.publicKey === appState.match.whiteClientKey;
        if (appState.match.botName) {
            window.services.arbitratorClient.challengeBot(appState.match.botName, !wasWhite, wasWhite, appState.match.timeControl, appState.auth);
        } else {
            const oppKey = wasWhite ? appState.match.blackClientKey : appState.match.whiteClientKey;
            window.services.arbitratorClient.challengePlayer(oppKey, !wasWhite, wasWhite, appState.match.timeControl, appState.auth);
        }
    }

    const handleBackgroundClick = () => {
        setIsVisible(false);
    }

    return <div className={"SummaryFrame"} onClick={handleBackgroundClick}>
        {isVisible &&
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
        }
    </div>
}
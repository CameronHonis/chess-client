import React from "react"
import "../styles/summary.css";
import {ReturnHomeAction} from "../models/actions/app/return_home_action";
import {appStateContext} from "../App";
import {MatchResult} from "../models/domain/match_result";

export interface SummaryProps {
}

export const Summary: React.FC<SummaryProps> = (props) => {
    const [appState, appDispatch] = React.useContext(appStateContext);
    const [isVisible, setIsVisible] = React.useState(true);
    const match = appState.match!;

    const [outcomeDesc, outcomeExpl] = React.useMemo(() => {
        switch (match.result) {
            case MatchResult.WHITE_WINS_BY_CHECKMATE:
                return ["White wins", "by checkmate"];
            case MatchResult.BLACK_WINS_BY_CHECKMATE:
                return ["Black wins", "by checkmate"];
            case MatchResult.WHITE_WINS_BY_RESIGNATION:
                return ["White wins", "by resignation"];
            case MatchResult.BLACK_WINS_BY_RESIGNATION:
                return ["Black wins", "by resignation"];
            case MatchResult.WHITE_WINS_BY_TIMEOUT:
                return ["White wins", "by timeout"];
            case MatchResult.BLACK_WINS_BY_TIMEOUT:
                return ["Black wins", "by timeout"];
            case MatchResult.DRAW_BY_INSUFFICIENT_MATERIAL:
                return ["Draw", "by insufficient material"];
            case MatchResult.DRAW_BY_THREEFOLD_REPETITION:
                return ["Draw", "by threefold repetition"];
            case MatchResult.DRAW_BY_FIFTY_MOVE_RULE:
                return ["Draw", "by 50-move rule"];
            case MatchResult.DRAW_BY_STALEMATE:
                return ["Draw", "by stalemate"];
            default:
                throw new Error("Unhandled match result: " + match.result);
        }
    }, [match.result]);

    const handleHomeClick = React.useCallback(() => {
        appDispatch(new ReturnHomeAction());
    }, [appDispatch]);

    const handleRematchClick = React.useCallback(() => {
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
    }, [appState.auth, appState.match]);

    const handleBackgroundClick = React.useCallback(() => {
        setIsVisible(false);
    }, []);

    return <>
        {isVisible && <div className={"SummaryFrame"} onClick={handleBackgroundClick}>
            <div className={"Summary"} onClick={ev => ev.stopPropagation()}>
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
        </div>}
    </>
}
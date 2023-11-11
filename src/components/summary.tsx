import React from "react"
import {Match} from "../models/match";
import {GameHelper} from "../helpers/game_helper";

export interface SummaryProps {
    match: Match;
}

export const Summary: React.FC<SummaryProps> = (props) => {
    const board = props.match.board;
    const [outcomeDesc, outcomeExpl]  = React.useMemo(() => {
        if (board.isWhiteWinner === board.isBlackWinner) {
            if (board.halfMoveClockCount >= 50) {
                return ["Draw", "by 50-move rule"];
            } else if (!board.getHasLegalMoves()) {
                return ["Draw", "by stalemate"];
            }
        }
    }, [board]);
    return <div className={"Summary"}>
        <p>{`${props.match.board.isWhiteWinner ? "White" : "Black"} won`}</p>
        <p></p>
    </div>
}
import {BoardLeftGutter} from "./board_left_gutter";
import {formatKey} from "../helpers/format_key";
import {MatchResult} from "../models/domain/match_result";
import {Summary} from "./summary";
import React from "react";
import {Match} from "../models/domain/match";
import {BoardFC} from "./board_fc";
import {Move} from "../models/domain/move";
import {appStateContext} from "../App";

interface Props {
    match: Match;
    viewingClientKey: string;
    isLocked: boolean;
}

export const MatchFC: React.FC<Props> = ({match, viewingClientKey, isLocked}) => {
    const [appState] = React.useContext(appStateContext);
    const auth = appState.auth!;
    const [isWhitePerspective, setIsWhitePerspective] = React.useState(initIsWhitePerspective(match, viewingClientKey));

    React.useEffect(() => {
        window.services.timer.setFromMatch(match);
    }, [match]);

    const [selfClientKey, oppClientKey] = React.useMemo(() => {
        if (isWhitePerspective) {
            return [match.whiteClientKey, match.blackClientKey];
        }
        return [match.blackClientKey, match.whiteClientKey];
    }, [match.whiteClientKey, match.blackClientKey, isWhitePerspective]);

    const sendMove = React.useCallback((move: Move) => {
        window.services.arbitratorClient.sendMove(match.uuid, move, auth);
    }, [match.uuid, auth]);

    return <div className={"BoardFrame"}>
        <BoardLeftGutter isWhitePerspective={isWhitePerspective}/>
        <div className={"BoardWrapped"}>
            <p className={"NameTag OppNameTag"}>{match.botName === "" ? formatKey(oppClientKey) : `${match.botName} bot`}</p>
            <BoardFC board={match.board} lastMove={match.lastMove} isWhitePerspective={isWhitePerspective}
                     isLocked={isLocked} sendMove={sendMove}/>
            <p className={"NameTag SelfNameTag"}>{formatKey(selfClientKey)}</p>
        </div>
        {match.result !== MatchResult.IN_PROGRESS && <Summary/>}
    </div>
}

function initIsWhitePerspective(match: Match, viewingClientKey: string): boolean {
    return match.blackClientKey !== viewingClientKey;
}
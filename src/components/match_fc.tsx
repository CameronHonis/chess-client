import {BoardLeftGutter} from "./board_left_gutter";
import {formatKey} from "../helpers/format_key";
import {MatchResult} from "../models/domain/match_result";
import {Summary} from "./summary";
import React from "react";
import {Match} from "../models/domain/match";
import {BoardFC} from "./board_fc";
import {Move} from "../models/domain/move";
import {appStateContext} from "../App";
import {BoardHorizontalGutter} from "./board_horizontal_gutter";

interface Props {
    match: Match;
    viewingClientKey: string;
    isLocked: boolean;
}

export const MatchFC: React.FC<Props> = ({match, viewingClientKey, isLocked}) => {
    const [isWhitePerspective, setIsWhitePerspective] = React.useState(initIsWhitePerspective(match, viewingClientKey));

    React.useEffect(() => {
        window.services.timer.setFromMatch(match);
    }, [match]);

    React.useEffect(() => {
        if (viewingClientKey === match.whiteClientKey) {
            setIsWhitePerspective(true);
        } else if (viewingClientKey === match.blackClientKey) {
            setIsWhitePerspective(false);
        }
    }, [viewingClientKey, match.whiteClientKey, match.blackClientKey]);

    const [selfClientKey, oppClientKey] = React.useMemo(() => {
        if (isWhitePerspective) {
            return [match.whiteClientKey, match.blackClientKey];
        }
        return [match.blackClientKey, match.whiteClientKey];
    }, [match.whiteClientKey, match.blackClientKey, isWhitePerspective]);

    const sendMove = React.useCallback((move: Move) => {
        window.services.arbitratorClient.sendMove(match.uuid, move);
    }, [match.uuid]);

    return <div className={"BoardFrame"}>
        <BoardLeftGutter isWhitePerspective={isWhitePerspective} matchResult={match.result} matchUuid={match.uuid}/>
        <div className={"BoardWrapped"}>
            <BoardHorizontalGutter isWhitePerspective={isWhitePerspective} isWhite={!isWhitePerspective}
                                   displayName={formatKey(oppClientKey)} materialOnBoard={match.board.material}/>
            <BoardFC board={match.board} lastMove={match.lastMove} isWhitePerspective={isWhitePerspective}
                     isLocked={isLocked} sendMove={sendMove}/>
            <BoardHorizontalGutter isWhitePerspective={isWhitePerspective} isWhite={isWhitePerspective}
                                   displayName={formatKey(selfClientKey)} materialOnBoard={match.board.material}/>
        </div>
        {match.result !== MatchResult.IN_PROGRESS && <Summary/>}
    </div>
}

function initIsWhitePerspective(match: Match, viewingClientKey: string): boolean {
    return match.blackClientKey !== viewingClientKey;
}
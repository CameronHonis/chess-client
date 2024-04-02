import {formatKey} from "../helpers/format_key";
import {MatchResult} from "../models/domain/match_result";
import {Summary} from "./summary";
import React from "react";
import {Match} from "../models/domain/match";
import {BoardFC} from "./board_fc";
import {Move} from "../models/domain/move";
import {CapturedPieces} from "./captured_pieces";
import {useIsMobile} from "../hooks/use_is_mobile";
import {Clock} from "./clock";
import {ResignButton} from "./resign_button";

interface Props {
    match: Match;
    viewingClientKey: string;
    isLocked: boolean;
}

export const MatchFC: React.FC<Props> = ({match, viewingClientKey, isLocked}) => {
    const [isWhitePerspective, setIsWhitePerspective] = React.useState(initIsWhitePerspective(match, viewingClientKey));
    const isMobile = useIsMobile();

    // TODO: evaluate if this is the best place/method of updating ClockAnimator
    React.useEffect(() => {
        window.services.clockAnimator.updateMatch(match);
    }, [match]);

    React.useEffect(() => {
        if (viewingClientKey === match.whiteClientKey) {
            setIsWhitePerspective(true);
        } else if (viewingClientKey === match.blackClientKey) {
            setIsWhitePerspective(false);
        }
    }, [viewingClientKey, match.whiteClientKey, match.blackClientKey]);

    const [selfDisplayName, oppDisplayName] = React.useMemo(() => {
        if (isWhitePerspective) {
            const selfDisplayName = formatKey(match.whiteClientKey);
            if (match.botName)
                return [selfDisplayName, `🤖${match.botName}`];
            else
                return [selfDisplayName, formatKey(match.blackClientKey)];
        } else {
            const selfDisplayName = formatKey(match.blackClientKey);
            if (match.botName)
                return [selfDisplayName, `🤖${match.botName}`];
            else
                return [selfDisplayName, formatKey(match.whiteClientKey)];
        }
    }, [match.botName, match.whiteClientKey, match.blackClientKey, isWhitePerspective]);

    const sendMove = React.useCallback((move: Move) => {
        window.services.arbitratorClient.sendMove(match.uuid, move);
    }, [match.uuid]);

    if (isMobile) {
        return <div className={"BoardFrame"}>
            <div className={"BoardTopGutter"}>
                <div className={"BoardTopGutter-Top"}>
                    <Clock isWhite={!isWhitePerspective}/>
                    <ResignButton matchUuid={match.uuid} matchResult={match.result}/>
                </div>
                <div className={"BoardTopGutter-Bottom"}>
                    <p className={"PlayerName"}>{oppDisplayName}</p>
                    <CapturedPieces isWhitePieces={isWhitePerspective} materialOnBoard={match.board.material}/>
                </div>
            </div>
            <BoardFC board={match.board} lastMove={match.lastMove} isWhitePerspective={isWhitePerspective}
                     isLocked={isLocked} sendMove={sendMove}/>
            <div className={"BoardBottomGutter"}>
                <div className={"BoardBottomGutter-Top"}>
                    <p className={"PlayerName"}>{selfDisplayName}</p>
                    <CapturedPieces isWhitePieces={!isWhitePerspective} materialOnBoard={match.board.material}/>
                </div>
                <div className={"BoardBottomGutter-Bottom"}>
                    <Clock isWhite={isWhitePerspective} isHomeClock/>
                </div>
            </div>
            {match.result !== MatchResult.IN_PROGRESS && <Summary/>}
        </div>
    } else { // not mobile
        return <div className={"BoardFrame"}>
            <div className={"BoardLeftGutter"}>
                <Clock isWhite={!isWhitePerspective}/>
                <div className={"LeftGutter-Bottom"}>
                    <ResignButton matchUuid={match.uuid} matchResult={match.result}/>
                    <Clock isWhite={isWhitePerspective} isHomeClock/>
                </div>
            </div>
            <div className={"BoardWrapped"}>
                <div className={"BoardTopGutter"}>
                    <p className={"PlayerName"}>{oppDisplayName}</p>
                    <CapturedPieces isWhitePieces={isWhitePerspective} materialOnBoard={match.board.material}/>
                </div>
                <BoardFC board={match.board} lastMove={match.lastMove} isWhitePerspective={isWhitePerspective}
                         isLocked={isLocked} sendMove={sendMove}/>
                <div className={"BoardBottomGutter"}>
                    <p className={"PlayerName"}>{selfDisplayName}</p>
                    <CapturedPieces isWhitePieces={!isWhitePerspective} materialOnBoard={match.board.material}/>
                </div>
            </div>
            {match.result !== MatchResult.IN_PROGRESS && <Summary/>}
        </div>
    }

}

function initIsWhitePerspective(match: Match, viewingClientKey: string): boolean {
    return match.blackClientKey !== viewingClientKey;
}
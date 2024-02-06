import React from "react";
import {appStateContext} from "../../App";
import {ChallengeCard} from "./challenge_card";
import "../../styles/challenges/challenges_overlay.css";

export function ChallengesOverlay() {
    const [appState, appStateDispatch] = React.useContext(appStateContext);
    const [isExpanded, setIsExpanded] = React.useState(false);

    const inboundCards = React.useMemo(() => {
        return appState.inboundChallenges.map(challenge => <ChallengeCard challenge={challenge}/>);
    }, [appState.inboundChallenges]);

    const outboundCards = React.useMemo(() => {
        return appState.outboundChallenges.map(challenge => <ChallengeCard challenge={challenge}/>)
    }, [appState.outboundChallenges]);

    return <div className="Challenges">
        {inboundCards}
        {outboundCards}
    </div>
}
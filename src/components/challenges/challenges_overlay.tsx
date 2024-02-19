import React from "react";
import {appStateContext} from "../../App";
import {ChallengeCard} from "./challenge_card";
import "../../styles/challenges/challenges_overlay.css";

export function ChallengesOverlay() {
    const [appState] = React.useContext(appStateContext);

    const inboundCards = React.useMemo(() => {
        return appState.inboundChallenges.map((challenge, idx) => <ChallengeCard challenge={challenge} key={idx}/>);
    }, [appState.inboundChallenges]);

    const outboundCards = React.useMemo(() => {
        return appState.outboundChallenges.map((challenge, idx) => <ChallengeCard challenge={challenge} key={idx}/>);
    }, [appState.outboundChallenges]);

    return <div className="Challenges">
        {inboundCards}
        {outboundCards}
    </div>
}
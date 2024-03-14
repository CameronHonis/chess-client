import React from "react";
import {Challenge} from "../../models/domain/challenge";
import {appStateContext} from "../../App";
import {formatKey} from "../../helpers/format_key";

export interface ChallengeCardProps {
    challenge: Challenge;
}

export function ChallengeCard(props: ChallengeCardProps) {
    const {
        challenge,
    } = props;
    const [appState] = React.useContext(appStateContext);

    const onAcceptClick = React.useCallback(() => {
        window.services.arbitratorClient.acceptChallenge(challenge.challengerKey);
    }, [challenge]);

    const onDeclineClick = React.useCallback(() => {
        window.services.arbitratorClient.declineChallenge(challenge.challengerKey);
    }, [challenge]);

    const onRevokeClick = React.useCallback(() => {
        window.services.arbitratorClient.revokeChallenge(challenge.challengedKey);
    }, [challenge]);

    const [isOutgoing, opponentName, selfColor] = React.useMemo(() => {
        const isColorsRandom = !challenge.isChallengerWhite && !challenge.isChallengerBlack;
        const publicKey = window.services.arbitratorClient.auth?.publicKey;
        if (challenge.challengerKey === publicKey) {
            const color = isColorsRandom ?
                "Random" : challenge.isChallengerWhite ? "White" : "Black";
            return [true, challenge.challengedKey, color];
        } else {
            const color = isColorsRandom ?
                "Random" : challenge.isChallengerWhite ? "Black" : "White";
            return [false, challenge.challengerKey, color];
        }
    }, [challenge]);

    const timeControlRepr = React.useMemo(() => {
        return challenge.timeControl.repr();
    }, [challenge.timeControl]);

    const colorLabel = React.useMemo(() => {
        const textColor = selfColor === "White" ? "white" : "black";
        return <p className="ChallengeCard-ColorLabel">as: <b style={{color: textColor}}>{selfColor}</b></p>;
    }, [selfColor]);

    return (
        appState.auth === null ?
            null
            :
            <div className="ChallengeCard">
                <div className="ChallengeCard-OppInfo">
                    <p className="ChallengeCard-OppName">{formatKey(opponentName)}</p>
                    <p className="ChallengeCard-OppRating">Rating: 1200</p>
                </div>
                <div className="ChallengeCard-MatchInfo">
                    {colorLabel}
                    <p className="ChallengeCard-TimeControl">{timeControlRepr}</p>
                </div>
                {isOutgoing ?
                    <div className={"ChallengeCard-OutboundControls"}>
                        <p className="ChallengeCard-OutMsg">
                            Waiting for response...
                        </p>
                        <button onClick={onRevokeClick} className={"ChallengeCard-Revoke"}>Cancel</button>
                    </div>
                    :
                    <div className="ChallengeCard-InboundControls">
                        <button onClick={onAcceptClick} className="ChallengeCard-Accept">Accept</button>
                        <button onClick={onDeclineClick} className="ChallengeCard-Decline">Decline</button>
                    </div>
                }
            </div>
    );
}
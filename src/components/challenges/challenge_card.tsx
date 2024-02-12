import React from "react";
import {Challenge} from "../../models/domain/challenge";
import {appStateContext} from "../../App";
import {formatKey} from "../../helpers/format_key";

export interface ChallengeCardProps {
    challenge: Challenge;
}

export function ChallengeCard(props: ChallengeCardProps) {
    const [appState] = React.useContext(appStateContext);
    const auth = appState.auth!;

    const onAcceptClick = React.useCallback(() => {
        window.services.arbitratorClient.acceptChallenge(
            props.challenge.uuid, props.challenge.challengerKey, auth);
    }, [props.challenge, auth]);

    const onDeclineClick = React.useCallback(() => {
        window.services.arbitratorClient.declineChallenge(
            props.challenge.uuid, props.challenge.challengerKey, auth);
    }, [props.challenge, auth]);

    const onRevokeClick = React.useCallback(()=> {
        window.services.arbitratorClient.revokeChallenge(
            props.challenge, auth);
    }, [props.challenge, auth]);

    const [isOutgoing, opponentName, selfColor] = React.useMemo(() => {
        if (!appState.auth)
            return [false, "", ""];
        const publicKey = appState.auth.publicKey;
        const isColorsRandom = !props.challenge.isChallengerWhite && !props.challenge.isChallengerBlack;
        if (props.challenge.challengerKey === publicKey) {
            const color = isColorsRandom ?
                "Random" : props.challenge.isChallengerWhite ? "White" : "Black";
            return [true, props.challenge.challengedKey, color];
        } else {
            const color = isColorsRandom ?
                "Random" : props.challenge.isChallengerWhite ? "Black" : "White";
            return [false, props.challenge.challengerKey, color];
        }
    }, [appState.auth, props.challenge]);

    const timeControlRepr = React.useMemo(() => {
        return props.challenge.timeControl.repr();
    }, [props.challenge.timeControl]);

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
    )
}
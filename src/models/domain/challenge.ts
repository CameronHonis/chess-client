import {ApiChallenge} from "../api/challenge";
import {TimeControl} from "./time_control";

export class Challenge {
    uuid: string;
    challengerKey: string;
    challengedKey: string;
    isChallengerWhite: boolean;
    isChallengerBlack: boolean;
    timeControl: TimeControl;
    botName: string;
    timeCreated: Date;

    constructor(args: Challenge) {
        this.uuid = args.uuid;
        this.challengerKey = args.challengerKey;
        this.challengedKey = args.challengedKey;
        this.isChallengerWhite = args.isChallengerWhite;
        this.isChallengerBlack = args.isChallengerBlack;
        this.timeControl = args.timeControl;
        this.botName = args.botName;
        this.timeCreated = args.timeCreated;
    }

    static fromApi(apiChallenge: ApiChallenge): Challenge {
        return new Challenge({
            uuid: apiChallenge.uuid,
            challengerKey: apiChallenge.challengerKey,
            challengedKey: apiChallenge.challengedKey,
            isChallengerWhite: apiChallenge.isChallengerWhite,
            isChallengerBlack: apiChallenge.isChallengerBlack,
            timeControl: TimeControl.fromApi(apiChallenge.timeControl),
            botName: apiChallenge.botName,
            timeCreated: apiChallenge.timeCreated,
        });
    }
}

export function newBulletTimeControl(): TimeControl {
    return new TimeControl({
        initialTimeSec: 60,
        incrementSec: 0,
        timeAfterMovesCount: 0,
        secAfterMoves: 0,
    });
}

export function newBlitzTimeControl(): TimeControl {
    return new TimeControl({
        initialTimeSec: 300,
        incrementSec: 0,
        timeAfterMovesCount: 0,
        secAfterMoves: 0,
    });
}

export function newRapidTimeControl(): TimeControl {
    return new TimeControl({
        initialTimeSec: 900,
        incrementSec: 0,
        timeAfterMovesCount: 0,
        secAfterMoves: 0,
    });
}

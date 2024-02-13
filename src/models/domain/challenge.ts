import {ApiChallenge} from "../api/challenge";
import {TimeControl} from "./time_control";
import {AuthKeyset} from "./auth_keyset";

export interface ChallengeArgs {
    uuid: string;
    challengerKey: string;
    challengedKey: string;
    isChallengerWhite: boolean;
    isChallengerBlack: boolean;
    timeControl: TimeControl;
    botName: string;
    timeCreated: Date;
    isActive: boolean;
}

export class Challenge {
    uuid: string;
    challengerKey: string;
    challengedKey: string;
    isChallengerWhite: boolean;
    isChallengerBlack: boolean;
    timeControl: TimeControl;
    botName: string;
    timeCreated: Date;
    isActive: boolean;

    constructor(args: ChallengeArgs) {
        this.uuid = args.uuid;
        this.challengerKey = args.challengerKey;
        this.challengedKey = args.challengedKey;
        this.isChallengerWhite = args.isChallengerWhite;
        this.isChallengerBlack = args.isChallengerBlack;
        this.timeControl = args.timeControl;
        this.botName = args.botName;
        this.timeCreated = args.timeCreated;
        this.isActive = args.isActive;
    }

    isInbound(auth: AuthKeyset): boolean {
        return this.challengedKey === auth.publicKey;
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
            isActive: apiChallenge.isActive,
        });
    }
}


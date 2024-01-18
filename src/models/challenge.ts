import {TimeControl} from "./time_control";

export interface ChallengeArgs {
    challengerKey: string;
    challengedKey: string;
    isChallengerWhite: boolean;
    isChallengerBlack: boolean;
    timeControl: TimeControl;
    botName: string;
}

export class Challenge {
    challengerKey: string;
    challengedKey: string;
    isChallengerWhite: boolean;
    isChallengerBlack: boolean;
    timeControl: TimeControl;
    botName: string;

    constructor({challengerKey, challengedKey, isChallengerWhite, isChallengerBlack, timeControl, botName}: ChallengeArgs) {
        this.challengerKey = challengerKey;
        this.challengedKey = challengedKey;
        this.isChallengerWhite = isChallengerWhite;
        this.isChallengerBlack = isChallengerBlack;
        this.timeControl = timeControl;
        this.botName = botName;
    }

    public isColorsRandom(): boolean {
        return this.isChallengerWhite === this.isChallengerBlack;
    }
}
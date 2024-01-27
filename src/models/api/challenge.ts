import {TimeControl} from "./time_control";
import {Templated} from "../../interfaces/templated";

export interface ChallengeArgs {
    challengerKey: string;
    challengedKey: string;
    isChallengerWhite: boolean;
    isChallengerBlack: boolean;
    timeControl: TimeControl;
    botName: string;
}

export class Challenge extends Templated {
    challengerKey: string;
    challengedKey: string;
    isChallengerWhite: boolean;
    isChallengerBlack: boolean;
    timeControl: TimeControl;
    botName: string;

    constructor({challengerKey, challengedKey, isChallengerWhite, isChallengerBlack, timeControl, botName}: ChallengeArgs) {
        super({});
        this.challengerKey = challengerKey;
        this.challengedKey = challengedKey;
        this.isChallengerWhite = isChallengerWhite;
        this.isChallengerBlack = isChallengerBlack;
        this.timeControl = timeControl;
        this.botName = botName;
    }

    isColorsRandom(): boolean {
        return this.isChallengerWhite === this.isChallengerBlack;
    }

    static template(): Object {
        return {
            challengerKey: "some-challenger-key",
            challengedKey: "some-challenged-key",
            isChallengerWhite: true,
            isChallengerBlack: false,
            timeControl: TimeControl.template(),
            botName: ""
        };
    }
}
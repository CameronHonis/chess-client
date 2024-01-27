import {Challenge} from "../../api/challenge";
import {Templated} from "../../../interfaces/templated";

export class ChallengeUpdatedMessageContent extends Templated {
    challenge: Challenge;

    constructor(args: ChallengeUpdatedMessageContent) {
        super({});
        this.challenge = args.challenge;
    }

    static template(): Object {
        return {
            challenge: Challenge.template(),
        };
    }
}
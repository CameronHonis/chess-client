import {Challenge} from "../../api/challenge";
import {Templated} from "../../../interfaces/templated";

export class ChallengeRequestFailedMessageContent extends Templated {
    challenge: Challenge;
    reason: string;

    constructor(args: ChallengeRequestFailedMessageContent) {
        super({});
        this.challenge = args.challenge;
        this.reason = args.reason;
    }

    static template(): Object {
        return {
            challenge: Challenge.template(),
            reason: "git gud before challenging me scrub",
        };
    }
}
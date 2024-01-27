import {Challenge} from "../../api/challenge";
import {Templated} from "../../../abcs/templated";

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
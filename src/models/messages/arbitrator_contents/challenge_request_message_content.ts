import {Challenge} from "../../api/challenge";
import {Templated} from "../../../interfaces/templated";

export class RequestChallengeMessageContent extends Templated {
    challenge: Challenge;

    constructor(args: RequestChallengeMessageContent) {
        super({});
        this.challenge = args.challenge;
    }

    static template(): Object {
        return {
            challenge: Challenge.template(),
        };
    }
}
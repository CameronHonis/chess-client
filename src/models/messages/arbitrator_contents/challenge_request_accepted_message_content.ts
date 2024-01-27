import {Templated} from "../../../interfaces/templated";

export class AcceptChallengeMessageContent extends Templated {
    challengerClientKey: string;

    constructor(args: AcceptChallengeMessageContent) {
        super({});
        this.challengerClientKey = args.challengerClientKey;
    }

    static template(): Object {
        return {
            challengerClientKey: "some-challenger-key"
        }
    }
}
import {Templated} from "../../../abcs/templated";

export class DeclineChallengeMessageContent extends Templated {
    challengerClientKey: string;

    constructor(args: DeclineChallengeMessageContent) {
        super({});
        this.challengerClientKey = args.challengerClientKey;
    }

    static template(): Object {
        return {
            challengerClientKey: "some-challenger-key",
        };
    }
}
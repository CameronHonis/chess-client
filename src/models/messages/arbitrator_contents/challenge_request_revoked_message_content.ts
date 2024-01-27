import {Templated} from "../../../abcs/templated";

export class RevokeChallengeMessageContent extends Templated {
    challengerClientKey: string;

    constructor(args: RevokeChallengeMessageContent) {
        super({});
        this.challengerClientKey = args.challengerClientKey;
    }

    static template(): Object {
        return {
            challengerClientKey: "some-challenger-key",
        };
    }
}
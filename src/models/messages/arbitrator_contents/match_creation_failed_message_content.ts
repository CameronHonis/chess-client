import {Templated} from "../../../abcs/templated";

export class MatchCreationFailedMessageContent extends Templated {
    whiteClientKey: string;
    blackClientKey: string;
    reason: string;

    constructor(args: MatchCreationFailedMessageContent) {
        super({});
        this.whiteClientKey = args.whiteClientKey;
        this.blackClientKey = args.blackClientKey;
        this.reason = args.reason;
    }

    static template(): Object {
        return {
            whiteClientKey: "some-client1-key",
            blackClientKey: "some-client2-key",
            reason: "client 1 ate black's king :(",
        };
    }
}
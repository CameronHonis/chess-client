import {Templated} from "../../../abcs/templated";

export class UpgradeAuthDeniedMessageContent extends Templated {
    reason: string;

    constructor(args: UpgradeAuthDeniedMessageContent) {
        super({});
        this.reason = args.reason;
    }

    static template(): Object {
        return {
            reason: "nice try, hacker mans",
        };
    }
}

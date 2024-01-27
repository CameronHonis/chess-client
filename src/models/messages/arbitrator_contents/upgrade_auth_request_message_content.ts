import {Templated} from "../../../abcs/templated";

export class UpgradeAuthRequestMessageContent extends Templated {
    role: string;
    secret: string;
    constructor(args: UpgradeAuthRequestMessageContent) {
        super({});
        this.role = args.role;
        this.secret = args.secret;
    }

    static template(): Object {
        return {
            role: "desired-role",
            secret: "p4ssw0rd123",
        }
    }
}

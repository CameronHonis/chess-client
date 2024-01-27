import {Templated} from "../../../interfaces/templated";

export class UpgradeAuthGrantedMessageContent extends Templated {
    upgradedToRole: string;

    constructor(args: UpgradeAuthGrantedMessageContent) {
        super({});
        this.upgradedToRole = args.upgradedToRole;
    }

    static template(): Object {
        return {
            upgradedToRole: "new-role"
        };
    }
}

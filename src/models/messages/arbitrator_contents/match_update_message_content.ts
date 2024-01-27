import {Match} from "../../api/match";
import {Templated} from "../../../abcs/templated";

export class MatchUpdateMessageContent extends Templated {
    match: Match;

    constructor(args: MatchUpdateMessageContent) {
        super({});
        this.match = new Match(args.match);
    }

    static template(): Object {
        return {
            match: Match.template(),
        };
    }
}

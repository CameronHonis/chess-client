import {Templated} from "../../../abcs/templated";
import {Move} from "../../game/move";

export class MoveMessageContent extends Templated {
    matchId: string;
    move: Move;

    constructor(args: MoveMessageContent) {
        super({});
        this.matchId = args.matchId;
        this.move = args.move;
    }

    static template(): Object {
        return {
            matchId: "some-match-id",
            move: Move.template(),
        };
    }
}

import {Templated} from "../../../abcs/templated";

export class EmptyMessageContent extends Templated {

    constructor(args: EmptyMessageContent) {
        super({});
    }

    static template(): Object {
        return {};
    }
}

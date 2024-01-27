import {Templated} from "../../../interfaces/templated";

export class EmptyMessageContent extends Templated {

    constructor(args: EmptyMessageContent) {
        super({});
    }

    static template(): Object {
        return {};
    }
}

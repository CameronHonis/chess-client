import {Templated} from "../../../interfaces/templated";

export class EchoMessageContent extends Templated {
    message: string;

    constructor(args: EchoMessageContent) {
        super({});
        this.message = args.message;
    }

    static template(): Object {
        return {
            message: "ECHO ECHo ECho Echo echo",
        };
    }
}

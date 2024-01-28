import {Templated} from "../../interfaces/templated";

export enum NotifType {
    ERROR = "ERROR",
    WARN = "WARN",
}

export class Notification extends Templated {
    type: NotifType;
    msg: string;

    constructor(args: Notification) {
        super({});
        this.type = args.type;
        this.msg = args.msg;
    }

    static template() {
        return {
            type: NotifType.ERROR,
            msg: "if you're reading this, it's too late",
        };
    }
}
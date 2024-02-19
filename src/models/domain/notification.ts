export enum NotifType {
    ERROR = "ERROR",
    WARN = "WARN",
}

export class Notification {
    type: NotifType;
    msg: string;

    constructor(args: Notification) {
        this.type = args.type;
        this.msg = args.msg;
    }
}
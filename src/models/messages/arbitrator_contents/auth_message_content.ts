import {Templated} from "../../../abcs/templated";

export class AuthMessageContent extends Templated {
    publicKey: string;
    privateKey: string;

    constructor(args: AuthMessageContent) {
        super({});
        this.publicKey = args.publicKey;
        this.privateKey = args.privateKey;
    }

    static template(): Object {
        return {
            publicKey: "some-public-key",
            privateKey: "some-private-key",
        };
    }
}

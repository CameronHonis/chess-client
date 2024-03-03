import {ArbitratorMessage} from "../api/messages/arbitrator_message";
import {MessageContentType} from "../api/messages/message_content_type";

export interface AuthKeysetArgs {
    publicKey: string;
    privateKey: string;
}

export class AuthKeyset {
    publicKey: string
    privateKey: string

    constructor(args: AuthKeysetArgs) {
        this.publicKey = args.publicKey
        this.privateKey = args.privateKey
    }

    sign<T extends MessageContentType>(msg: ArbitratorMessage<T>): ArbitratorMessage<T> {
        return new ArbitratorMessage<T>({
            ...msg,
            senderKey: this.publicKey,
            privateKey: this.privateKey,
        });
    }

    toLocalStorage(key: string) {
        window.localStorage.setItem(key, JSON.stringify(this));
    }

    static fromLocalStorage(key: string): AuthKeyset | undefined {
        const authJsonStr = window.localStorage.getItem(key);
        if (authJsonStr) {
            return new AuthKeyset(JSON.parse(authJsonStr));
        }
        return undefined;
    }
}
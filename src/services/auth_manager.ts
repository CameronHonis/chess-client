import {ArbitratorMessage} from "../models/messages/arbitrator/arbitrator_message";
import {Throwable} from "../types";

export interface AuthKeyset {
    publicKey: string
    privateKey: string
}

export class AuthManager {
    private arbitratorKeyset: AuthKeyset | undefined

    getArbitratorKeyset(): AuthKeyset | undefined {
        return this.arbitratorKeyset
    }

    setArbitratorKeyset(keyset: AuthKeyset | undefined) {
        if (keyset) {
            this.arbitratorKeyset = {...keyset};
        }
    }

    signMessage(msg: ArbitratorMessage<any>): Throwable<void> {
        if (this.arbitratorKeyset == null) {
            throw new Error("attempt to sign message without auth creds");
        }
        msg.senderKey = this.arbitratorKeyset.publicKey;
        msg.privateKey = this.arbitratorKeyset.privateKey;
    }
}
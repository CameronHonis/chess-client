import {ArbitratorMessage} from "./arbitrator_message";
import {Throwable} from "../../types";
import {AuthKeyset} from "../../services/auth_manager";
import {ArbitratorTopic} from "../enums/message_content_type";

interface AuthMessageConstructorArgs {
    topic: ArbitratorTopic
    publicKey: string;
    privateKey: string;
}

export class ArbitratorAuthMessage implements ArbitratorMessage {
    topic: ArbitratorTopic
    publicKey: string
    privateKey: string

    constructor({topic, publicKey, privateKey}: AuthMessageConstructorArgs) {
        this.topic = topic;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    static fromJSON(json: object): Throwable<ArbitratorAuthMessage> {
        if (!("publicKey" in json) || !("privateKey" in json)) {
            throw new Error(`Could not parse critical fields of AuthMessage from json:\n${json}`);
        }
        let publicKey = json["publicKey"];
        let privateKey = json["privateKey"];
        if (typeof publicKey !== "string") {
            if (typeof publicKey === "number") {
                publicKey = publicKey.toString();
            } else {
                throw new Error(`Could not parse publicKey string from json:\n${json}`);
            }
        }
        if (typeof privateKey !== "string") {
            if (typeof privateKey === "number") {
                privateKey = privateKey.toString();
            } else {
                throw new Error(`Could not parse privateKey string from json:\n${json}`);
            }
        }
        return new ArbitratorAuthMessage({
            topic: ArbitratorTopic.MATCHMAKING,
            publicKey: publicKey as string,
            privateKey: privateKey as string
        });
    }

    toKeyset(): AuthKeyset {
        return {
            publicKey: this.publicKey,
            privateKey: this.privateKey
        };
    }
}
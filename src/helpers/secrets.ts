import {Throwable} from "../types";

export enum Secret {
    ARBITRATOR_DOMAIN = "ARBITRATOR_DOMAIN",
    ARBITRATOR_PORT = "ARBITRATOR_PORT"
}

export function getSecret(secretName: Secret): Throwable<string> {
    const secret = process.env[`REACT_APP_${secretName}`];
    if (!secret)
        throw new Error(`secret ${secretName} not configured`);
    return secret;
}
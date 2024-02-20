import {Throwable} from "../types";

export enum Secret {
    ARBITRATOR_URL = "ARBITRATOR_URL",
}

export function getSecret(secretName: Secret): Throwable<string> {
    const secret = process.env[`REACT_APP_${secretName}`];
    if (!secret)
        throw new Error(`secret ${secretName} not configured`);
    return secret;
}
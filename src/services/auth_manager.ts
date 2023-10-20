import {AuthDomain} from "../models/enums/auth_domain";

export interface AuthKeyset {
    publicKey: string
    privateKey: string
}

export class AuthManager {
    keysetByDomain: Map<AuthDomain, AuthKeyset>

    constructor() {
        this.keysetByDomain = new Map();
    }

    getKeysetForDomain(domain: AuthDomain): AuthKeyset | undefined {
        if (this.keysetByDomain.has(domain)) {
            return this.keysetByDomain.get(domain);
        }
        return;
    }

    setKeysetOnDomain(domain: AuthDomain, keyset: AuthKeyset) {
        this.keysetByDomain.set(domain, keyset);
    }
}
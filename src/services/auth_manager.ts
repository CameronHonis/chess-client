
export interface AuthKeyset {
    publicKey: string
    privateKey: string
}

export class AuthManager {
    arbitratorKeyset: AuthKeyset | undefined
}
import {AppStateAction, AppStateActionType} from "./app_state_action";

export interface UpdateAuthPayload {
    publicKey: string;
    privateKey: string;
}

export class UpdateAuthAction implements AppStateAction {
    type = AppStateActionType.UPDATE_AUTH;
    payload: UpdateAuthPayload;

    constructor(publicKey: string, privateKey: string) {
        this.payload = {
            publicKey,
            privateKey
        };
    }
}

export function isUpdateAuthAction(action: AppStateAction): action is UpdateAuthAction {
    return action.type === AppStateActionType.UPDATE_AUTH
}
import {AppStateAction, AppStateActionType} from "./app_state_action";
import {Challenge} from "../domain/challenge";

export interface UpdateChallangePayload {
    isInbound: boolean;
    newChallenge: Challenge;
}

export class UpdateChallengeAction implements AppStateAction {
    type = AppStateActionType.UPDATE_CHALLENGE;
    payload: UpdateChallangePayload;

    constructor(isInbound: boolean, challenge: Challenge) {
        this.payload = {
            isInbound: isInbound,
            newChallenge: challenge,
        };
    }
}

export function isUpdateChallengeAction(action: AppStateAction): action is UpdateChallengeAction {
    return action.type === AppStateActionType.UPDATE_CHALLENGE;
}
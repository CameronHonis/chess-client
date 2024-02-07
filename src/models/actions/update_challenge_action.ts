import {AppStateAction, AppStateActionType} from "./app_state_action";
import {Challenge} from "../domain/challenge";

export interface UpdateChallangePayload {
    newChallenge: Challenge;
}

export class UpdateChallengeAction implements AppStateAction {
    type = AppStateActionType.UPDATE_CHALLENGE;
    payload: UpdateChallangePayload;

    constructor(challenge: Challenge) {
        this.payload = {
            newChallenge: challenge,
        };
    }
}

export function isUpdateChallengeAction(action: AppStateAction): action is UpdateChallengeAction {
    return action.type === AppStateActionType.UPDATE_CHALLENGE;
}
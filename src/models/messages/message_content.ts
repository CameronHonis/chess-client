import {Match} from "../match";
import {Move} from "../move";

export interface EmptyMessageContent {

}

export interface AuthMessageContent {
    publicKey: string;
    privateKey: string;
}


export interface FindBotMatchMessageContent {
    botName: string;
}

export interface FindMatchMessageContent {

}

export interface MatchUpdateMessageContent {
    match: Match;
}

export interface MoveMessageContent {
    matchId: string;
    move: Move;
}

export interface SubscribeRequestMessageContent {

}

export interface SubscribeRequestGrantedMessageContent {

}

export interface SubscribeRequestDeniedMessageContent {

}

export interface FindBotMatchNoBotsMessageContent {

}

export interface EchoMessageContent {

}

export interface UpgradeAuthRequestMessageContent {

}

export interface UpgradeAuthGrantedMessageContent {

}

export interface UpgradeAuthDeniedMessageContent {

}

export interface InitBotSuccessMessageContent {

}

export interface InitBotFailureMessageContent {

}

export enum AppStateActionType {
    MATCH_UPDATE_RECEIVED="MATCH_UDPATE_RECEIVED",

}

export abstract class AppStateAction {
    abstract type: AppStateActionType;
    abstract payload: any;
}
export enum AppStateActionType {
    MATCH_UPDATE_RECEIVED="MATCH_UPDATE_RECEIVED",
    RETURNED_HOME="RETURNED_HOME",
}

export abstract class AppStateAction {
    abstract type: AppStateActionType;
    abstract payload: any;
}
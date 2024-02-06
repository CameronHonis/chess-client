export enum AppStateActionType {
    UPDATE_AUTH="UPDATE_AUTH",
    UPDATE_MATCH="UPDATE_MATCH",
    INGEST_MOVE="INGEST_MOVE",
    RETURN_HOME="RETURN_HOME",
    UPDATE_CHALLENGE="UPDATE_CHALLENGE",
}

export abstract class AppStateAction {
    abstract type: AppStateActionType;
    abstract payload: any;
}
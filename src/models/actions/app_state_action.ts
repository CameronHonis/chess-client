export enum AppStateActionType {
    UPDATE_MATCH="UPDATE_MATCH",
    INGEST_MOVE="INGEST_MOVE",
    RETURN_HOME="RETURN_HOME",
}

export abstract class AppStateAction {
    abstract type: AppStateActionType;
    abstract payload: any;
}
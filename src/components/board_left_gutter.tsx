import {Clock} from "./clock";
import React from "react";
import "../styles/board_left_gutter.css";
import {appStateContext} from "../App";

export interface BoardLeftGutterProps {
    isWhitePerspective: boolean;
}

export function BoardLeftGutter(props: BoardLeftGutterProps) {
    const [appState] = React.useContext(appStateContext);
    const {isWhitePerspective} = props;
    const onResignClick = () => {
        window.services.arbitratorClient.resignMatch(appState.match!.uuid, appState.auth!);
    }

    return <div className={"BoardLeftGutter"}>
        <Clock isWhite={!isWhitePerspective}/>
        <div className={"LeftGutter-Bottom"}>
            <button className={"Resign"} onClick={onResignClick}>resign</button>
            <Clock isWhite={isWhitePerspective} isHomeClock/>
        </div>
    </div>
}
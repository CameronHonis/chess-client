import {Clock} from "./clock";
import React from "react";
import "../styles/board_left_gutter.css";
import {appStateContext} from "../App";
import {Button} from "./button";
import {MatchResult} from "../models/domain/match_result";

export interface BoardLeftGutterProps {
    isWhitePerspective: boolean;
}

export function BoardLeftGutter(props: BoardLeftGutterProps) {
    const [appState] = React.useContext(appStateContext);
    const [isLocked, setIsLocked] = React.useState(true);
    const {isWhitePerspective} = props;
    const match = appState.match!;
    const auth = appState.auth!;

    const onResignClick = React.useCallback(() => {
        if (isLocked) {
            setIsLocked(false);
            setTimeout(() => {
                setIsLocked(true);
            }, 2000);
        } else {
            window.services.arbitratorClient.resignMatch(match.uuid, auth);
        }
    }, [isLocked, setIsLocked, match.uuid, auth]);

    const [resignButtonClassName, resignButtonContent] = React.useMemo(() => {
        const content = isLocked ? "Resign" : "Confirm";
        const classNames = ["ResignButton"];
        if (!isLocked) {
            classNames.push("ResignButton-Unlocked");
        }
        return [classNames.join(" "), content];
    }, [isLocked]);

    return <div className={"BoardLeftGutter"}>
        <Clock isWhite={!isWhitePerspective}/>
        <div className={"LeftGutter-Bottom"}>
            {
                match.result === MatchResult.IN_PROGRESS &&
                <Button className={resignButtonClassName} onClick={onResignClick} content={resignButtonContent}
                        isDebounced/>
            }
            <Clock isWhite={isWhitePerspective} isHomeClock/>
        </div>
    </div>
}
import React from "react";
import {MatchResult} from "../models/domain/match_result";
import {Button} from "./button";

interface Props {
    matchUuid: string;
    matchResult: MatchResult;
}

export function ResignButton(props: Props) {
    const [isProtected, setIsProtected] = React.useState(true);
    const {matchUuid, matchResult} = props;

    const onResignClick = React.useCallback(() => {
        if (isProtected) {
            setIsProtected(false);
            setTimeout(() => {
                setIsProtected(true);
            }, 2000);
        } else {
            setIsProtected(true);
            window.services.arbitratorClient.resignMatch(matchUuid);
        }
    }, [isProtected, setIsProtected, matchUuid]);

    const [resignButtonClassName, resignButtonContent] = React.useMemo(() => {
        const content = isProtected ? "Resign" : "Confirm";
        const classNames = ["ResignButton"];
        if (!isProtected) {
            classNames.push("ResignButton-Unlocked");
        }
        return [classNames.join(" "), content];
    }, [isProtected]);

    if (matchResult === MatchResult.IN_PROGRESS) {
        return <Button className={resignButtonClassName} onClick={onResignClick} content={resignButtonContent}
                       isDebounced/>
    } else {
        return <></>;
    }
}
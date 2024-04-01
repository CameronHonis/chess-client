import React from "react";
import {Button} from "../button";
import {TimeControlPreset} from "../../models/domain/time_control";
// @ts-ignore
import bulletIcon from "../../res/images/bullet.png";
// @ts-ignore
import blitzIcon from "../../res/images/blitz.png";
// @ts-ignore
import rapidIcon from "../../res/images/rapid.png";

export interface TimeControlOptionProps {
    timeControl: TimeControlPreset;
    timeControlSelected: TimeControlPreset;
    setTimeControlSelected: React.Dispatch<React.SetStateAction<TimeControlPreset>>
}

export function TimeControlOption(props: TimeControlOptionProps) {
    const buttonClassNames = React.useMemo(() => {
        const classNames = ["TimeControlOption"];
        switch(props.timeControl) {
            case TimeControlPreset.BULLET:
                classNames.push("TimeControlOption-Bullet");
                break;
            case TimeControlPreset.BLITZ:
                classNames.push("TimeControlOption-Blitz");
                break;
            case TimeControlPreset.RAPID:
                classNames.push("TimeControlOption-RAPID");
                break;
            default:
                throw new Error(`unknown time control preset given '${props.timeControl}' while rendering TimeControlOptions`);
        }
        if (props.timeControlSelected === props.timeControl) {
            classNames.push("Selected");
        }
        return classNames;
    }, [props.timeControl, props.timeControlSelected]);

    const buttonContent = React.useMemo(() => {
        switch(props.timeControl) {
            case TimeControlPreset.BULLET:
                return <>
                    <img src={bulletIcon} alt={"bullet"} />
                    <p>1 + 0</p>
                </>;
            case TimeControlPreset.BLITZ:
                return <>
                    <img src={blitzIcon} alt={"blitz"} />
                    <p>5 + 0</p>
                </>;
            case TimeControlPreset.RAPID:
                return <>
                    <img src={rapidIcon} alt={"rapid"} />
                    <p>15 + 0</p>
                </>;
            default:
                throw new Error(`unknown time control preset given '${props.timeControl}' while rendering TimeControlOptions`);
        }
    }, [props.timeControl]);

    return <Button className={buttonClassNames.join(" ")} content={buttonContent}
                   onClick={() => props.setTimeControlSelected(props.timeControl)} isDebounced/>
}
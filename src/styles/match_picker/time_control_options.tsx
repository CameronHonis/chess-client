import React from "react";
import {TimeControlPreset} from "../../models/domain/time_control";
// @ts-ignore
import timerIcon from "../../res/images/timer.png";
import {TimeControlOption} from "../../components/match_picker/time_control_option";
import "../../styles/match_picker/time_control_options.css";

export interface TimeControlOptionsProps {
    selectedTimeControlPreset: TimeControlPreset;
    setSelectedTimeControlPreset: React.Dispatch<React.SetStateAction<TimeControlPreset>>;
}

export function TimeControlOptions(props: TimeControlOptionsProps) {
    return <div className={"TimeControls"}>
        <img src={timerIcon} alt={"timer"} className={"TimerIcon"}/>
        <div className={"Divider"}/>
        <TimeControlOption timeControl={TimeControlPreset.BULLET}
                           timeControlSelected={props.selectedTimeControlPreset}
                           setTimeControlSelected={props.setSelectedTimeControlPreset}/>
        <TimeControlOption timeControl={TimeControlPreset.BLITZ}
                           timeControlSelected={props.selectedTimeControlPreset}
                           setTimeControlSelected={props.setSelectedTimeControlPreset}/>
        <TimeControlOption timeControl={TimeControlPreset.RAPID}
                           timeControlSelected={props.selectedTimeControlPreset}
                           setTimeControlSelected={props.setSelectedTimeControlPreset}/>
    </div>
}
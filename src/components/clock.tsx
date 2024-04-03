import React from "react";
import "../styles/clock.css";

export interface TimerProps {
    isWhite: boolean;
    isHomeClock?: boolean;
}

export const Clock: React.FC<TimerProps> = (props) => {
    const classNames = React.useMemo(() => {
        const rtn = ["Clock"];
        if (props.isWhite) {
            rtn.push("WhiteClock");
        } else {
            rtn.push("BlackClock");
        }
        if (props.isHomeClock) {
            rtn.push("HomeClock");
        } else {
            rtn.push("AwayClock");
        }
        return rtn;
    }, [props.isWhite, props.isHomeClock]);

    return <div className={classNames.join(" ")}>
        0:00
    </div>
}
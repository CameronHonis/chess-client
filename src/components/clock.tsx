import React from "react";
import "../styles/clock.css";

export interface TimerProps {
    isWhite: boolean;
    isHomeClock?: boolean;
}

export const Clock: React.FC<TimerProps & {[key: string]: any}> = (props) => {
    const [displaySeconds, setDisplaySeconds] = React.useState<string>("00.0");

    React.useEffect(() => {
        window.services.timer.registerClockStateSetter(props.isWhite, setDisplaySeconds);
    }, [props.isWhite]);

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
        {displaySeconds}
    </div>
}
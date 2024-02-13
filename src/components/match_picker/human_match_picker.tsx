import React from "react"
import {Button} from "../button";
import {Dots} from "../dots";
import "../../styles/match_picker/human_match_picker.css";
import {appStateContext} from "../../App";
import {dispatchErr} from "../../models/events/notif_event";
import {TimeControl, TimeControlPreset} from "../../models/domain/time_control";
import {TimeControlOptions} from "../../styles/match_picker/time_control_options";

export interface HumanMatchPickerProps {
    isSearchingMatch: boolean;
    setIsSearchingMatch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HumanMatchPicker: React.FC<HumanMatchPickerProps> = (props) => {
    const {
        isSearchingMatch,
        setIsSearchingMatch
    } = props;

    const [appState] = React.useContext(appStateContext);
    const [selectedTimeControlPreset, setSelectedTimeControlPreset] = React.useState(TimeControlPreset.RAPID);
    const auth = appState.auth!;

    const handlePlayButtonClick = React.useCallback((_: React.MouseEvent<HTMLButtonElement>) => {
        setIsSearchingMatch(true);
        window.services.arbitratorClient.joinMatchmaking(TimeControl.fromPreset(selectedTimeControlPreset), auth);
    }, [auth, setIsSearchingMatch, selectedTimeControlPreset]);

    const handleCancelButtonClick = React.useCallback((_: React.MouseEvent<HTMLButtonElement>) => {
        setIsSearchingMatch(false);
        window.services.arbitratorClient.leaveMatchmaking(auth);
    }, [auth, setIsSearchingMatch]);

    return <div className={"HumanMatchPicker"}>
        <h2>A Human</h2>
        {
            isSearchingMatch ?
                <>
                    <p>finding a match based on your elo</p>
                    <Dots style={{width: "50%", height: "20%"}}/>
                    <Button content="Cancel" className="CancelMatchmakingButton" isDebounced
                            onClick={handleCancelButtonClick}/>
                </>
                :
                <>
                    <div className={"HumanMatchPicker-MatchmakingMetrics"}>
                        <p>match players based on your...</p>
                        <p id={"EloTag"}>Elo: 1000</p>
                        <p>and your...</p>
                        <p id={"WinstreakTag"}>Winstreak: +0</p>
                    </div>
                    <div className={"HumanMatchPicker-Controls"}>
                        <TimeControlOptions selectedTimeControlPreset={selectedTimeControlPreset}
                                            setSelectedTimeControlPreset={setSelectedTimeControlPreset}/>
                    </div>
                    <Button content="Play" className="PlayButton" isDebounced onClick={handlePlayButtonClick}/>
                </>
        }
    </div>
}
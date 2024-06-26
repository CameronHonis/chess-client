import React from "react"
import {Button} from "../button";
import {Dots} from "../dots";
import "../../styles/match_picker/human_match_picker.css";
import {TimeControl, TimeControlPreset} from "../../models/domain/time_control";
import {TimeControlOptions} from "../../styles/match_picker/time_control_options";
//@ts-ignore
import backIcon from "../../res/images/back-button.png";

export interface HumanMatchPickerProps {
    isSearchingMatch: boolean;
    setIsSearchingMatch: React.Dispatch<React.SetStateAction<boolean>>;
    onBackButtonClick?: () => void;
}

export const HumanMatchPicker: React.FC<HumanMatchPickerProps> = (props) => {
    const {
        isSearchingMatch,
        setIsSearchingMatch,
        onBackButtonClick,
    } = props;
    const [selectedTimeControlPreset, setSelectedTimeControlPreset] = React.useState(TimeControlPreset.RAPID);

    const handlePlayButtonClick = React.useCallback((_: React.MouseEvent<HTMLButtonElement>) => {
        setIsSearchingMatch(true);
        window.services.arbitratorClient.joinMatchmaking(TimeControl.fromPreset(selectedTimeControlPreset));
    }, [setIsSearchingMatch, selectedTimeControlPreset]);

    const handleCancelButtonClick = React.useCallback((_: React.MouseEvent<HTMLButtonElement>) => {
        setIsSearchingMatch(false);
        window.services.arbitratorClient.leaveMatchmaking();
    }, [setIsSearchingMatch]);

    return <div className={"HumanMatchPicker"}>
        {onBackButtonClick &&
            <img src={backIcon} alt="back button" className="HumanMatchPicker-Back" onClick={onBackButtonClick}/>}
        <h2> A Human</h2>
        {
            isSearchingMatch ?
                <>
                    <Dots style={{width: "50%", height: "20%"}}/>
                    <p className={"MatchmakingContext"}>Searching for a match</p>
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
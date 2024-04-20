import React, {ReactElement} from "react";
import {BotDroplistItem} from "./bot_droplist_item";
import "../../styles/match_picker/bot_match_picker.css";
import {Button} from "../button";
import {BotType} from "../../models/domain/bot_type";
import {TimeControl, TimeControlPreset} from "../../models/domain/time_control";
import {TimeControlOptions} from "../../styles/match_picker/time_control_options";
//@ts-ignore
import backIcon from "../../res/images/back-button.png";

export interface BotMatchPickerProps {
    onBackButtonClick?: () => void;
}

export const BotMatchPicker: React.FC<BotMatchPickerProps> = (props) => {
    const {
        onBackButtonClick
    } = props;
    const [selectedBotName, setSelectedBotName] = React.useState<BotType>(BotType.RANDOM);
    const [selectedTimeControlPreset, setSelectedTimeControlPreset] = React.useState(TimeControlPreset.RAPID);

    const handlePlayButtonClicked = React.useCallback(() => {
        window.services.arbitratorClient.challengeBot(
            selectedBotName, true, true, TimeControl.fromPreset(selectedTimeControlPreset));
    }, [selectedBotName, selectedTimeControlPreset]);

    const botNames = [BotType.RANDOM, BotType.STOCKFISH, BotType.MILA, BotType.NOT_IMPLEMENTED];
    const botDroplistItems: ReactElement[] = [];
    for (let botName of botNames) {
        botDroplistItems.push(
            <BotDroplistItem isSelected={botName === selectedBotName} setSelectedBotName={setSelectedBotName}
                             botName={botName} key={botName}/>
        );
    }
    return <div className={"BotMatchPicker"}>
        {onBackButtonClick &&
            <img src={backIcon} alt="back button" className="HumanMatchPicker-Back" onClick={onBackButtonClick}/>}
        <h2>A Robot</h2>
        <div className={"BotsDroplist"}>
            {botDroplistItems}
        </div>
        <div className={"HumanMatchPicker-Controls"}>
            <TimeControlOptions selectedTimeControlPreset={selectedTimeControlPreset}
                                setSelectedTimeControlPreset={setSelectedTimeControlPreset}/>
        </div>
        <Button content={"Challenge"} className={"PlayButton"} isDebounced onClick={handlePlayButtonClicked}/>
    </div>
}
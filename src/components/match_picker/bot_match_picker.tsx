import React, {ReactElement} from "react";
import {BotDroplistItem} from "./bot_droplist_item";
import "../../styles/match_picker/bot_match_picker.css";
import {Button} from "../button";
import {BotType} from "../../models/domain/bot_type";
import {appStateContext} from "../../App";
import {dispatchErr} from "../../models/events/notif_event";
import {newBlitzTimeControl} from "../../models/domain/time_control";

export interface BotMatchPickerProps {
}

export const BotMatchPicker: React.FC<BotMatchPickerProps> = (props) => {
    const [selectedBotName, setSelectedBotName] = React.useState<BotType>(BotType.RANDOM);

    const handlePlayButtonClicked = React.useCallback(() => {
        window.services.arbitratorClient.challengeBot(
            selectedBotName, true, true, newBlitzTimeControl());
    }, [selectedBotName]);

    const botNames = [BotType.RANDOM, BotType.NOT_IMPLEMENTED];
    const botDroplistItems: ReactElement[] = [];
    for (let botName of botNames) {
        botDroplistItems.push(
            <BotDroplistItem isSelected={botName === selectedBotName} setSelectedBotName={setSelectedBotName}
                             botName={botName} key={botName}/>
        );
    }
    return <div className={"BotMatchPicker"}>
        <h2>A Robot</h2>
        <div className={"BotsDroplist"}>
            {botDroplistItems}
        </div>
        <Button content={"Challenge"} className={"PlayButton"} isDebounced onClick={handlePlayButtonClicked}/>
    </div>
}
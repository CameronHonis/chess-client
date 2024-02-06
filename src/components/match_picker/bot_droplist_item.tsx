import React from "react";
import "../../styles/match_picker/bot_droplist_item.css";
import {BotType} from "../../models/domain/bot_type";

export interface BotDroplistItemProps {
    isSelected: boolean;
    setSelectedBotName: React.Dispatch<React.SetStateAction<BotType>>;
    botName: BotType;
}

export const BotDroplistItem: React.FC<BotDroplistItemProps> = (props) => {
    const {
        botName,
        isSelected,
        setSelectedBotName
    } = props;
    return <div className={"BotDroplistItem" + (isSelected ? " Selected" : "")} onClick={() => setSelectedBotName(botName)}>
        <div className={"BotDroplistItem-SelectedDot" + (isSelected ? " Selected" : "")}/>
        <p className={"BotDroplistItem-Nametag"}>{botName}</p>
    </div>
}
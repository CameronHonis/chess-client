import React from "react";
import {HumanMatchPicker} from "./human_match_picker";
import {BotMatchPicker} from "./bot_match_picker";
import "../../styles/match_picker/match_picker.css";


export const MatchPicker: React.FC = () => {
    const [isSearchingMatch, setIsSearchingMatch] = React.useState<boolean>(false);

    return <div className="MatchPickerPage">
        <h1>Start match</h1>
        <p className="MatchPickerPage-Subtitle">play against...</p>
        <div className="MatchPickerWrappers">
            <HumanMatchPicker isSearchingMatch={isSearchingMatch} setIsSearchingMatch={setIsSearchingMatch}/>
            {!isSearchingMatch && <BotMatchPicker/>}
        </div>
    </div>
}

export enum MatchType {
    HUMAN = "HUMAN",
    BOT = "BOT"
}

export const MatchPickerMobile: React.FC = () => {
    const [matchType, setMatchType] = React.useState<MatchType | null>(null);
    const [isSearchingMatch, setIsSearchingMatch] = React.useState<boolean>(false);

    if (matchType === null) {
        return <div className="MatchPickerPage">
            <p className="MatchPickerPage-Prompt">Play against...</p>
            <button className="MatchPickerPageOption Human" onClick={() => setMatchType(MatchType.HUMAN)}>Human</button>
            <button className="MatchPickerPageOption Bot" onClick={() => setMatchType(MatchType.BOT)}>Bot</button>
        </div>
    } else if (matchType === MatchType.HUMAN) {
        return <div className="MatchPickerPage">
            <HumanMatchPicker isSearchingMatch={isSearchingMatch} setIsSearchingMatch={setIsSearchingMatch}
                              onBackButtonClick={() => setMatchType(null)}/>
        </div>
    } else if (matchType === MatchType.BOT) {
        return <div className="MatchPickerPage">
            <BotMatchPicker onBackButtonClick={() => setMatchType(null)}/>
        </div>
    } else {
        return <div></div>
    }
}
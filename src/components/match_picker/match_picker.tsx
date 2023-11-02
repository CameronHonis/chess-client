import React from "react";
import {HumanMatchPicker} from "./human_match_picker";
import {BotMatchPicker} from "./bot_match_picker";
import "../../styles/match_picker/match_picker.css";
import "../../styles/match_picker/buttons.css";


export const MatchPicker: React.FC = () => {
    const [isSearchingMatch, setIsSearchingMatch] = React.useState<boolean>(false);

    return <div className="MatchPickerPage">
        <h1>Start match</h1>
        <p className="MatchPickerPage-Subtitle">play against...</p>
        <div className="MatchPickerWrappers">
            <HumanMatchPicker isSearchingMatch={isSearchingMatch} setIsSearchingMatch={setIsSearchingMatch} />
            {!isSearchingMatch && <BotMatchPicker />}
        </div>
    </div>
}
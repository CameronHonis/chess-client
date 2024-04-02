import {MatchPicker, MatchPickerMobile} from "./match_picker/match_picker";
import React from "react";
import {useIsMobile} from "../hooks/use_is_mobile";

export function Home() {
    const isMobile = useIsMobile();

    return <div className="Home">
        {isMobile && <MatchPickerMobile/> || <MatchPicker/>}
    </div>
}
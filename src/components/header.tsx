import React from "react";
import "../styles/header.css";

// @ts-ignore
import logo from "../res/images/cage.png"
import {appStateContext} from "../App";
import {ReturnHomeAction} from "../models/actions/app/return_home_action";

export interface HeaderProps {
}

export const Header: React.FC<HeaderProps> = (props) => {
    const [_, dispatch] = React.useContext(appStateContext)

    const onHeaderClick = React.useCallback(() => {
        dispatch(new ReturnHomeAction());
    }, [dispatch]);

    return <div className="Header" onClick={onHeaderClick}>
        <div className={"Header-Identifiers"}>
            <img id="HeaderLogo" src={logo} alt={"logo"}/>
            <h1 id="HeaderTitle">The Cage</h1>
        </div>
    </div>
}
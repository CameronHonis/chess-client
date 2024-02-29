import React from "react";
import "../styles/header.css";

// @ts-ignore
import logo from "../res/cage.png"

export interface HeaderProps {
}
export const Header: React.FC<HeaderProps> = (props) => {
    return <div className="Header">
        <div className={"Header-Identifiers"}>
            <img id="HeaderLogo" src={logo} alt={"logo"}/>
            <h1 id="HeaderTitle">The Cage</h1>
        </div>
    </div>
}
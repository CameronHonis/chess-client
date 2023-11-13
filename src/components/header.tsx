import React from "react";
import "../styles/header.css";

export interface HeaderProps {
}
export const Header: React.FC<HeaderProps> = (props) => {
    return <div className="Header">
        <h1 id="HeaderTitle">Chess Cave</h1>
    </div>
}
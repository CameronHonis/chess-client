import React from "react";
import "../styles/header.css";

export interface HeaderProps {
    headerRef: React.RefObject<HTMLDivElement>;
}
export const Header: React.FC<HeaderProps> = (props) => {
    return <div className="Header" ref={props.headerRef}>
        <h1 id="HeaderTitle">Chess Cave</h1>
    </div>
}
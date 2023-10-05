import React from "react";
import {Board} from "./board";
import "../styles/board_frame.css";

export const BoardFrame: React.FC = () => {
    return <div className="BoardFrame">
        <Board/>
    </div>
}
import React from "react";
import {formatTimeForTimer} from "../helpers/format_time";
import {Match} from "../models/domain/match";

export class Timer {
    whiteSeconds: number;
    blackSeconds: number;
    isWhiteTurn: boolean;
    private intervalId: NodeJS.Timer | null;
    whiteClockStateSetter?: React.Dispatch<React.SetStateAction<string>>;
    blackClockStateSetter?: React.Dispatch<React.SetStateAction<string>>;
    isPaused: boolean;

    constructor() {
        this.whiteSeconds = 0;
        this.blackSeconds = 0;
        this.isWhiteTurn = true;
        this.intervalId = null;
        this.isPaused = false;
        this.resetInterval();
    }

    private resetInterval() {
        if (this.intervalId != null) {
            clearInterval(this.intervalId);
        }
        this.updateClockState();
        this.intervalId = setInterval(() => this.onTick(), 100);
    }

    private onTick() {
        if (this.isPaused) { return; }
        if (!this.whiteClockStateSetter || !this.blackClockStateSetter) { return; }
        if (this.isWhiteTurn) {
            this.whiteSeconds = Math.max(0, this.whiteSeconds - 0.1);
        } else {
            this.blackSeconds = Math.max(0, this.blackSeconds - 0.1);
        }
        this.updateClockState();
    }

    private updateClockState() {
        if (!this.whiteClockStateSetter || !this.blackClockStateSetter) { return }
        const whiteFormattedTime = formatTimeForTimer(this.whiteSeconds);
        this.whiteClockStateSetter(whiteFormattedTime);
        const blackFormattedTime = formatTimeForTimer(this.blackSeconds);
        this.blackClockStateSetter(blackFormattedTime);
    }

    setFromMatch(match: Match) {
        this.whiteSeconds = match.whiteTimeRemaining;
        this.blackSeconds = match.blackTimeRemaining;
        this.isWhiteTurn = match.board.isWhiteTurn;
        this.isPaused = match.board.isTerminal;
        this.resetInterval();
    }

    registerClockStateSetter(isWhite: boolean, clockStateSetter: React.Dispatch<React.SetStateAction<string>>) {
        if (isWhite) {
            this.whiteClockStateSetter = clockStateSetter;
        } else {
            this.blackClockStateSetter = clockStateSetter;
        }
    }
}
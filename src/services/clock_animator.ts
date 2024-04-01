import {Match} from "../models/domain/match";
import {newBlitzTimeControl, newRapidTimeControl, TimeControl} from "../models/domain/time_control";
import {MatchResult} from "../models/domain/match_result";

const RAPID_INIT_SECS = newRapidTimeControl().initialTimeSec;
const BLITZ_INIT_SECS = newBlitzTimeControl().initialTimeSec;

export class ClockAnimator {
    private timeControl: TimeControl = newBlitzTimeControl();
    private isWhiteTurn: boolean = false;
    private whiteSecs: number = 0;
    private blackSecs: number = 0;
    private isPaused: boolean = false;

    private intervalId: NodeJS.Timer | null = null;

    updateMatch(match: Match) {
        this.timeControl = match.timeControl;

        let needsIntervalReset = false;
        if (this.whiteSecs !== match.whiteTimeRemainingSec) {
            needsIntervalReset = true;
            this.whiteSecs = match.whiteTimeRemainingSec;
        }
        if (this.blackSecs !== match.blackTimeRemainingSec) {
            needsIntervalReset = true;
            this.blackSecs = match.blackTimeRemainingSec;
        }
        const isPaused = match.result !== MatchResult.IN_PROGRESS;
        if (this.isPaused !== isPaused) {
            needsIntervalReset = true;
            this.isPaused = isPaused;
        }
        if (this.isWhiteTurn !== match.board.isWhiteTurn) {
            needsIntervalReset = true;
            this.isWhiteTurn = match.board.isWhiteTurn;
        }

        if (needsIntervalReset) {
            this.resetInterval();
        }
    }

    private resetInterval() {
        if (this.intervalId != null) {
            clearInterval(this.intervalId);
        }
        this.animate();
        this.intervalId = setInterval(() => this.onTick(), 100);
    }

    private onTick() {
        if (this.isPaused) {
            return;
        }

        if (this.isWhiteTurn) {
            this.whiteSecs = Math.max(0, this.whiteSecs - 0.1);
        } else {
            this.blackSecs = Math.max(0, this.blackSecs - 0.1);
        }

        this.animate();
    }

    private animate() {
        const whiteDisplayTime = ClockAnimator.formatTime(this.whiteSecs);
        const isWhiteLowTime = ClockAnimator.isLowTime(this.timeControl, this.whiteSecs);
        const blackDisplayTime = ClockAnimator.formatTime(this.blackSecs);
        const isBlackLowTime = ClockAnimator.isLowTime(this.timeControl, this.blackSecs);

        const whiteClockDiv = document.querySelector(".WhiteClock");
        if (whiteClockDiv instanceof HTMLDivElement) {
            whiteClockDiv.textContent = whiteDisplayTime;
            if (isWhiteLowTime) {
                whiteClockDiv.classList.add("LowTime");
            } else {
                whiteClockDiv.classList.remove("LowTime");
            }
        }
        const blackClockDiv = document.querySelector(".BlackClock");
        if (blackClockDiv instanceof HTMLDivElement) {
            blackClockDiv.textContent = blackDisplayTime;
            if (isBlackLowTime) {
                blackClockDiv.classList.add("LowTime");
            } else {
                blackClockDiv.classList.remove("LowTime");
            }
        }
    }

    static formatTime(seconds: number): string {
        if (seconds >= 59) {
            let wholeMinutes = Math.floor(seconds / 60);
            let wholeSeconds = Math.ceil(seconds % 60);
            if (wholeSeconds === 60) {
                wholeMinutes++;
                wholeSeconds = 0;
            }
            return `${wholeMinutes}:${wholeSeconds >= 10 ? wholeSeconds : "0" + wholeSeconds}`;
        } else {
            let wholeSeconds = Math.floor(seconds);
            let wholeTenths = Math.ceil(10 * (seconds % 1));
            if (wholeTenths === 10) {
                wholeSeconds++;
                wholeTenths = 0;
            }
            return `${wholeSeconds >= 10 ? wholeSeconds : "0" + wholeSeconds}.${wholeTenths}`;
        }
    }

    static isLowTime(timeControl: TimeControl, secs: number): boolean {
        if (timeControl.initialTimeSec >= RAPID_INIT_SECS) {
            return secs <= 60;
        } else if (timeControl.initialTimeSec >= BLITZ_INIT_SECS) {
            return secs <= 20;
        } else {
            return secs <= 10;
        }
    }
}
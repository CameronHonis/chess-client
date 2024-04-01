import {Match} from "../models/domain/match";
import {
    newBlitzTimeControl,
    newBulletTimeControl,
    newRapidTimeControl,
    TimeControl
} from "../models/domain/time_control";
import {MatchResult} from "../models/domain/match_result";

const RAPID_INIT_SECS = newRapidTimeControl().initialTimeSec;
const BLITZ_INIT_SECS = newBlitzTimeControl().initialTimeSec;
const BULLET_INIT_SECS = newBulletTimeControl().initialTimeSec;

export class ClockAnimator {
    private readonly whiteClock: HTMLDivElement;
    private readonly blackClock: HTMLDivElement;
    private readonly timeControl: TimeControl;

    private isWhiteTurn: boolean = false;
    private whiteSecs: number = 0;
    private blackSecs: number = 0;
    private isPaused: boolean = false;

    private intervalId: NodeJS.Timer | null;

    constructor(whiteClock: HTMLDivElement, blackClock: HTMLDivElement, match: Match) {
        this.whiteClock = whiteClock;
        this.blackClock = blackClock;
        this.timeControl = match.timeControl;
        this.intervalId = null;

        this.updateMatch(match);
    }

    private resetInterval() {
        if (this.intervalId != null) {
            clearInterval(this.intervalId);
        }
        this.onTick();
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

        const whiteDisplayTime = ClockAnimator.formatTime(this.whiteSecs);
        const whiteTimeRed = ClockAnimator.isClockRed(this.timeControl, this.whiteSecs);
        const blackDisplayTime = ClockAnimator.formatTime(this.blackSecs);
        const blackTimeRed = ClockAnimator.isClockRed(this.timeControl, this.blackSecs);

    }

    updateMatch(match: Match) {
        this.whiteSecs = match.whiteTimeRemainingSec;
        this.blackSecs = match.blackTimeRemainingSec;
        this.isPaused = match.result !== MatchResult.IN_PROGRESS;

        this.resetInterval();
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

    static isClockRed(timeControl: TimeControl, secs: number): boolean {
        if (timeControl.initialTimeSec >= RAPID_INIT_SECS) {
            return secs <= 60;
        } else if (timeControl.initialTimeSec >= BLITZ_INIT_SECS) {
            return secs <= 20;
        } else {
            return secs >= 10;
        }
    }
}
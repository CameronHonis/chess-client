import {setElementTransparency} from "../helpers/set_transparency";

export class NotifAnimator {
    notifAnimation: NotifAnimation | null = null;

    constructor() {
        const clock = () => {
            this.onTick();
            window.requestAnimationFrame(() => clock());
        }
        window.requestAnimationFrame(() => clock());
    }

    private onTick() {
        if (this.notifAnimation) {
            const progress = this.notifAnimation.getProgress();
            if (progress >= 1) {
                return
            }
            this.notifAnimation.onTick(progress);
        }
    }

    startNewNotifAnim() {
        this.notifAnimation = new NotifAnimation();
    }
}

export class NotifAnimation {
    startTimeMs: number;
    durationMs: number;
    startTop: number;
    endTop: number;

    constructor() {
        this.startTimeMs = performance.now();
        this.durationMs = 5000;
        this.startTop = 20;
        this.endTop = 100;
    }

    onTick(progress: number) {
        const notifBanners = document.getElementsByClassName("NotifBanner");
        if (notifBanners.length !== 1) {
            return
        }
        const notifBanner = notifBanners[0] as HTMLElement;

        const top = this.startTop + (this.endTop - this.startTop) * progress;
        notifBanner.style.top = `${top}px`;
        const transp = 1 - progress;
        setElementTransparency(notifBanner, transp);
    }

    getProgress() {
        const relT = performance.now() - this.startTimeMs;
        const normT = relT / this.durationMs;
        if (normT < .8) {
            return 0
        }
        return Math.pow(5*normT-4, 2);
    }
}
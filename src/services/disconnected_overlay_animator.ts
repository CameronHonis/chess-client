export class DisconnectedOverlayAnimator {
    overlayRef: HTMLDivElement;
    isConnected: boolean = true;
    disconnectedAtMs: number = 0;

    targVis: number = 0;
    vis: number = 0;
    isTicking: boolean = false;


    constructor(overlayRef: HTMLDivElement) {
        this.overlayRef = overlayRef;
        this.setConnected();
    }

    setDisconnected() {
        this.isConnected = false;
        const now = performance.now();
        this.disconnectedAtMs = now;

        setTimeout(() => {
            if (!this.isConnected && this.disconnectedAtMs === now) {
                this._setOverlayVisibility(true);
            }
        }, 1000);
    }

    setConnected() {
        this.isConnected = true;
        this._setOverlayVisibility(false);
    }

    private _setOverlayVisibility(isVisible: boolean) {
        this.targVis = isVisible ? 1 : 0;
        if (!this.isTicking) {
            this._tick(performance.now());
        }
    }

    private _tick(lastTickMs: number) {
        if (Math.abs(this.vis - this.targVis) < .0001) {
            this.isTicking = false;
            return;
        }

        this.isTicking = true;
        const now = performance.now();
        const dMs = now - lastTickMs;
        const dVisTarg = this.targVis - this.vis;
        let dVis: number;
        if (dVisTarg > 0) {
            dVis = dMs / 1000;
        } else {
            dVis = -dMs / 250;
        }
        this.vis += Math.sign(dVisTarg) * Math.min(Math.abs(dVisTarg), Math.abs(dVis));

        this.overlayRef.style.opacity = this.vis.toString();

        window.requestAnimationFrame(() => this._tick(now));
    }


}
export class DisconnectedOverlayAnimator {
    overlayRef: HTMLDivElement;
    isConnected: boolean = true;
    disconnectedAtMs: number = 0;

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
        const className = isVisible ? "DisconnectedOverlay Visible" : "DisconnectedOverlay";
        console.log(className);
        this.overlayRef.className = className;
    }
}
export class ArbitratorClient {
    url = "ws://localhost:8080";
    websocket: WebSocket;
    constructor() {
        this.websocket = new WebSocket(this.url);
        this.websocket.onopen = (e) => this._handleOpen(e);
        this.websocket.onmessage = (e) => this._handleMessage(e);
        this.websocket.onclose = (e) => this._handleClose(e);
    }

    _handleOpen(e: Event) {
        console.log(`websocket connection established with websocket on ${this.url}`);
        this.websocket.send("we love you");
    }

    _handleMessage(e: Event) {
        console.log(`raw event: ${e}`);
        console.log(`[${this.url}]  >>  ${e.target}`);
    }

    _handleClose(e: Event) {
        console.warn("arbitrator client websocket connection closed");
    }
}
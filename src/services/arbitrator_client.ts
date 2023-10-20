import {BotType} from "../models/enums/bot_type";
import {MessageListener} from "../helpers/websocket_listeners/message_listener";
import {ARBITRATOR_URL} from "../constants";
import {ArbitratorTopic} from "../models/enums/message_topic";
import {ArbitratorAuthListener} from "../helpers/websocket_listeners/arbitrator_auth_listener";

export class ArbitratorClient {
    websocket: WebSocket;
    messageListenersByTopic: Map<ArbitratorTopic, (typeof MessageListener)[]>;

    constructor() {
        this.websocket = new WebSocket(`wss://${ARBITRATOR_URL}`);
        this.websocket.onopen = (e) => this._handleOpen(e);
        this.websocket.onmessage = (e) => this._handleMessage(e);
        this.websocket.onclose = (e) => this._handleClose(e);
        this.websocket.onerror = () => {
            console.warn("Could not establish websocket connection on secure channel, reverting to unsecured channel")
            this.websocket = new WebSocket(`ws://${ARBITRATOR_URL}`);
            this.websocket.onopen = (e) => this._handleOpen(e);
            this.websocket.onmessage = (e) => this._handleMessage(e);
            this.websocket.onclose = (e) => this._handleClose(e);
            this.websocket.onerror = (e) => {
                console.warn("Could not establish websocket connection");
                throw e;
            }
        }

        this.messageListenersByTopic = new Map();
        this.addMessageListener(ArbitratorAuthListener, ArbitratorTopic.MATCHMAKING);
    }

    _handleOpen(e: Event) {
        const url = (e.currentTarget as WebSocket).url;
        console.log(`websocket connection established with websocket on ${url}`);
        this.websocket.send("we love you");
    }

    _handleMessage(e: MessageEvent) {
        if (typeof e.data !== "string") {
            console.warn(`Flushing unhandled websocket data type: ${typeof e.data}`)
            return;
        }
        const url = (e.currentTarget as WebSocket).url
        console.log(`[${url}] >> ${e.data}`);
        let msg: object
        try {
            msg = JSON.parse(e.data);
        } catch (e) {
            console.warn("Could not parse JSON from websocket response");
            return;
        }
        if (!("topic" in msg)) {
            console.warn("Could not identify topic from websocket response");
        }
        //@ts-ignore
        const topic: ArbitratorTopic = msg["topic"];
        const messageListeners = this.messageListenersByTopic.get(topic) || [];
        for (let messageListener of messageListeners) {
            messageListener.receiveMessage(e);
        }
    }

    _handleClose(e: CloseEvent) {
        const url = (e.currentTarget as WebSocket).url
        console.warn(`arbitrator client websocket connection on ${url} closed`);
    }

    addMessageListener(msgListener: typeof MessageListener, topic: ArbitratorTopic) {
        if (!this.messageListenersByTopic.has(topic)) {
            this.messageListenersByTopic.set(topic, []);
        }
        this.messageListenersByTopic.get(topic)?.push(msgListener);
    }

    requestBotMatch(botType: BotType) {
        // this.websocket.send(JSON.stringify(msg));
    }

    requestPlayerMatch(playerId: number) {

    }
}
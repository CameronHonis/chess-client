import {BotType} from "../models/enums/bot_type";
import {ARBITRATOR_URL} from "../constants";
import {Throwable} from "../types";
import {ArbitratorMessage} from "../models/messages/arbitrator_message";
import {ArbitratorMessageEvent, DocumentEventMapExt} from "../models/events/arbitrator_message_event";
import {MessageContentType} from "../models/enums/message_content_type";

export class ArbitratorClient {
    websocket: WebSocket;

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
        // @ts-ignore
        document.addEventListener<>("arbitratorMessage-AUTH", (e: ArbitratorMessageEvent<MessageContentType.AUTH>) => {
            window.services.authManager.arbitratorKeyset = {
                publicKey: e.msg.content
            }
        });
    }

    _handleOpen(e: Event) {
        const url = (e.currentTarget as WebSocket).url;
        console.log(`websocket connection established with websocket on ${url}`);
        this.websocket.send("we love you");
    }

    _handleMessage(e: MessageEvent): Throwable<void> {
        if (typeof e.data !== "string") {
            console.warn(`Flushing unhandled websocket data type: ${typeof e.data}`)
            return;
        }
        const url = (e.currentTarget as WebSocket).url
        console.log(`[${url}] >> ${e.data}`);
        const contentType = ArbitratorClient._validateMessageEventAndParseContent(e);
        // @ts-ignore
        new CustomEvent(`arbitratorMessage-${contentType}`, {msg: e.data});
        new ArbitratorMessageEvent()
    }

    static _validateMessageEventAndParseContent(e: MessageEvent): Throwable<string> {
        const msg = JSON.parse(e.data);
        if (!("contentType" in msg)) {
            throw new Error("could not identify message contentType");
        }
        if (typeof msg["contentType"] !== "string") {
            throw new Error("contentType is not a string");
        }
        return msg["contentType"]
    }


    _handleClose(e: CloseEvent) {
        const url = (e.currentTarget as WebSocket).url
        console.warn(`arbitrator client websocket connection on ${url} closed`);
    }

    requestBotMatch(botType: BotType) {
        // this.websocket.send(JSON.stringify(msg));
    }

    requestPlayerMatch(playerId: number) {

    }
}
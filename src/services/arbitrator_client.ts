import {BotType} from "../models/enums/bot_type";
import {ARBITRATOR_URL} from "../constants";
import {Throwable} from "../types";
import {ArbitratorMessage} from "../models/messages/arbitrator_message";
import {ArbitratorMessageEventPayload} from "../models/events/arbitrator_message_event";
import {MessageContentType} from "../models/enums/message_content_type";
import {AuthKeyset} from "./auth_manager";

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
        document.addEventListener("arbitratorMessage-AUTH", (e: CustomEvent<ArbitratorMessageEventPayload<MessageContentType.AUTH>>) => {
            const content = e.detail.msg.content
            const keyset: AuthKeyset = {
                publicKey: content.publicKey,
                privateKey: content.privateKey,
            }
            window.services.authManager.setArbitratorKeyset(keyset);
        });
    }

    _handleOpen(e: Event) {
        const url = (e.currentTarget as WebSocket).url;
        console.log(`websocket connection established with websocket on ${url}`);
    }

    _handleMessage(e: MessageEvent): Throwable<void> {
        if (typeof e.data !== "string") {
            console.warn(`Flushing unhandled websocket data type: ${typeof e.data}`)
            return;
        }
        const url = (e.currentTarget as WebSocket).url
        console.log(`[${url}] >> ${e.data}`);
        const contentType = ArbitratorClient._validateMessageEventAndParseContentType(e);
        const msg = JSON.parse(e.data);
        type MessagePayloadType = ArbitratorMessageEventPayload<typeof contentType>
        const ev = new CustomEvent<MessagePayloadType>(`arbitratorMessage-${contentType}`, {
            detail: {
                msg,
            },
        });
        document.dispatchEvent(ev);
    }

    static _validateMessageEventAndParseContentType(e: MessageEvent): Throwable<keyof typeof MessageContentType> {
        const msg = JSON.parse(e.data);
        if (!("contentType" in msg)) {
            throw new Error("could not identify message contentType");
        }
        type a = typeof MessageContentType
        if (typeof msg["contentType"] !== "string") {
            throw new Error("contentType is not a string");
        }
        return msg["contentType"] as MessageContentType
    }


    _handleClose(e: CloseEvent) {
        const url = (e.currentTarget as WebSocket).url
        console.warn(`arbitrator client websocket connection on ${url} closed`);
    }

    sendMessage(msg: ArbitratorMessage<any>, signed = true): Throwable<void> {
        if (this.websocket.readyState !== 1) {
            throw new Error(`cannot send message, websocket not open. got readyState = ${this.websocket.readyState}`);
        }
        if (signed) {
            window.services.authManager.signMessage(msg);
        }
        const stringifiedMsg = JSON.stringify(msg);
        console.log(`[${this.websocket.url}] << ${stringifiedMsg}`);
        this.websocket.send(stringifiedMsg);
    }

    requestBotMatch(botType: BotType) {
        const msg = new ArbitratorMessage({
            topic: "findBotMatch",
            contentType: MessageContentType.FIND_BOT_MATCH,
            content: {
                botName: botType,
            },
            senderKey: "",
            privateKey: ""
        });
        this.sendMessage(msg);
    }

    requestPlayerMatch() {
        const msg = new ArbitratorMessage({
            topic: "findMatch",
            contentType: MessageContentType.FIND_MATCH,
            content: {},
            senderKey: "",
            privateKey: "",
        })
        this.sendMessage(msg);
    }
}
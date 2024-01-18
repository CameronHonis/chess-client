import {BotType} from "../models/enums/bot_type";
import {ARBITRATOR_URL} from "../constants";
import {Throwable} from "../types";
import {ArbitratorMessage, parseMessageFromJsonObj} from "../models/messages/arbitrator/arbitrator_message";
import {MessageEventPayload} from "../models/events/message_event";
import {MessageContentType} from "../models/enums/message_content_type";
import {AuthKeyset} from "./auth_manager";
import {MessageEventName, parseEventName} from "../models/enums/message_event_name";
import {ArbitratorMessageEventMap} from "../global";
import {Move} from "../models/move";

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
        document.addEventListener(MessageEventName.AUTH, (e: CustomEvent<MessageEventPayload<MessageContentType.AUTH>>) => {
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
        const msgJsonObj = JSON.parse(e.data);
        const msg = parseMessageFromJsonObj(msgJsonObj);
        const eventName = parseEventName(msg.contentType);
        type EventType = ArbitratorMessageEventMap[typeof eventName];
        document.dispatchEvent(new CustomEvent<EventType>(eventName, {
            detail: {
                // @ts-ignore why tho????
                msg,
            }
        }));
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

    challengePlayer(playerKey: string): Throwable<void> {
        const msg = new ArbitratorMessage({
            topic: "challenge",
            contentType: MessageContentType.CHALLENGE_REQUEST,
            content: {
                playerKey,
            },
        })
    }

    challengeBot(botType: BotType): Throwable<void> {

    }

    findMatch(): Throwable<void> {
        const msg = new ArbitratorMessage({
            topic: "findMatch",
            contentType: MessageContentType.FIND_MATCH,
            content: {},
            senderKey: "",
            privateKey: "",
        })
        this.sendMessage(msg);
    }

    sendMove(matchId: string, move: Move): Throwable<void> {
        const msg = new ArbitratorMessage({
            topic: `match-${matchId}`,
            contentType: MessageContentType.MOVE,
            content: {
                matchId,
                move,
            },
            senderKey: "",
            privateKey: "",
        });
        this.sendMessage(msg);
    }
}
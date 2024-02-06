import {BotType} from "../models/domain/bot_type";
import {ARBITRATOR_URL} from "../constants";
import {Throwable} from "../types";
import {ArbitratorMessageEventPayload} from "../models/events/message_event";
import {parseEventName} from "../models/events/message_event_name";
import {Move} from "../models/domain/move";
import {ArbitratorMessage} from "../models/api/messages/arbitrator_message";
import {MessageContentType} from "../models/api/messages/message_content_type";
import {ApiTimeControl} from "../models/api/time_control";
import {AuthKeyset} from "../models/domain/auth_keyset";

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
    }

    private _handleOpen(e: Event) {
        const url = (e.currentTarget as WebSocket).url;
        console.log(`websocket connection established with websocket on ${url}`);
    }

    private _handleMessage(e: MessageEvent): Throwable<void> {
        if (typeof e.data !== "string") {
            console.warn(`Flushing unhandled websocket data type: ${typeof e.data}`)
            return;
        }
        const url = (e.currentTarget as WebSocket).url
        console.log(`[${url}] >> ${e.data}`);

        const msgJsonObj = JSON.parse(e.data);
        const msg = ArbitratorMessage.fromJson(msgJsonObj);

        const eventName = parseEventName(msg.contentType);
        type EventType = ArbitratorMessageEventPayload<typeof msg.contentType>;
        const event = new CustomEvent<EventType>(eventName, {
            detail: {
                msg,
            }
        });

        document.dispatchEvent(event);
    }

    private _handleClose(e: CloseEvent) {
        const url = (e.currentTarget as WebSocket).url
        console.warn(`arbitrator client websocket connection on ${url} closed`);
    }

    signAndSendMsg(msg: ArbitratorMessage<any>, auth: AuthKeyset): Throwable<void> {
        if (this.websocket.readyState !== 1) {
            throw new Error(`cannot send message, websocket not open. got readyState = ${this.websocket.readyState}`);
        }
        const signedMsg = auth.sign(msg);
        return this.sendMsg(signedMsg);
    }

    sendMsg(msg: ArbitratorMessage<any>): Throwable<void> {
        const stringifiedMsg = JSON.stringify(msg);
        console.log(`[${this.websocket.url}] << ${stringifiedMsg}`);
        this.websocket.send(stringifiedMsg);
    }

    challengePlayer(playerKey: string, isWhite: boolean, isBlack: boolean, timeControl: ApiTimeControl, auth: AuthKeyset): Throwable<void> {
        const msg = new ArbitratorMessage({
            topic: "challenge",
            contentType: MessageContentType.CHALLENGE_REQUEST,
            content: {
                challenge: {
                    uuid: "",
                    challengerKey: auth.publicKey,
                    challengedKey: playerKey,
                    isChallengerWhite: isWhite,
                    isChallengerBlack: isBlack,
                    timeControl: timeControl,
                    botName: "",
                },
            },
            senderKey: "",
            privateKey: "",
        });
        this.signAndSendMsg(msg, auth);
    }

    challengeBot(botType: BotType, isWhite: boolean, isBlack: boolean, timeControl: ApiTimeControl, auth: AuthKeyset): Throwable<void> {
        const msg = new ArbitratorMessage({
            topic: "challenge",
            contentType: MessageContentType.CHALLENGE_REQUEST,
            content: {
                challenge: {
                    uuid: "",
                    challengerKey: auth.publicKey,
                    challengedKey: "",
                    isChallengerWhite: isWhite,
                    isChallengerBlack: isBlack,
                    timeControl: timeControl,
                    botName: botType,
                },
            },
            senderKey: "",
            privateKey: "",
        });
        this.signAndSendMsg(msg, auth);
    }

    findMatch(auth: AuthKeyset): Throwable<void> {
        const msg = new ArbitratorMessage({
            topic: "findMatch",
            contentType: MessageContentType.FIND_MATCH,
            content: {},
            senderKey: "",
            privateKey: "",
        })
        this.signAndSendMsg(msg, auth);
    }

    sendMove(matchId: string, move: Move, auth: AuthKeyset): Throwable<void> {
        const msg = new ArbitratorMessage({
            topic: `match-${matchId}`,
            contentType: MessageContentType.MOVE,
            content: {
                matchId,
                move: JSON.parse(JSON.stringify(move)),
            },
            senderKey: "",
            privateKey: "",
        });
        this.signAndSendMsg(msg, auth);
    }
}
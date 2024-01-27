import {BotType} from "../models/enums/bot_type";
import {ARBITRATOR_URL} from "../constants";
import {Throwable} from "../types";
import {ArbitratorMessage, parseMessageFromJson} from "../models/messages/arbitrator_message";
import {MessageEventPayload} from "../models/events/message_event";
import {MessageContentType} from "../models/enums/message_content_type";
import {AuthKeyset} from "./auth_manager";
import {MessageEventName, parseEventName} from "../models/enums/message_event_name";
import {ArbitratorMessageEventMap} from "../global";
import {Move} from "../models/game/move";
import {Challenge} from "../models/api/challenge";
import {TimeControl} from "../models/api/time_control";

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
        const msg = parseMessageFromJson(msgJsonObj);
        const eventName = parseEventName(msg.contentType);
        type EventType = ArbitratorMessageEventMap[typeof eventName];
        document.dispatchEvent(new CustomEvent<EventType>(eventName, {
            detail: {
                // @ts-ignore - why?
                msg,
            }
        }));
    }

    private _handleClose(e: CloseEvent) {
        const url = (e.currentTarget as WebSocket).url
        console.warn(`arbitrator client websocket connection on ${url} closed`);
    }

    signAndSendMsg(msg: ArbitratorMessage<any>, signed = true): Throwable<void> {
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

    challengePlayer(playerKey: string, isWhite: boolean, isBlack: boolean, timeControl: TimeControl): Throwable<void> {
        const msg = new ArbitratorMessage({
            topic: "challenge",
            contentType: MessageContentType.CHALLENGE_REQUEST,
            content: {
                challenge: new Challenge({
                    challengerKey: window.services.authManager.getArbitratorKeyset()!.publicKey,
                    challengedKey: playerKey,
                    isChallengerWhite: isWhite,
                    isChallengerBlack: isBlack,
                    timeControl: timeControl,
                    botName: "",
                })
            },
            senderKey: "",
            privateKey: "",
        });
        this.signAndSendMsg(msg);
    }

    challengeBot(botType: BotType, isWhite: boolean, isBlack: boolean, timeControl: TimeControl): Throwable<void> {
        const msg = new ArbitratorMessage({
            topic: "challenge",
            contentType: MessageContentType.CHALLENGE_REQUEST,
            content: {
                challenge: new Challenge({
                    challengerKey: window.services.authManager.getArbitratorKeyset()!.publicKey,
                    challengedKey: "",
                    isChallengerWhite: isWhite,
                    isChallengerBlack: isBlack,
                    timeControl: timeControl,
                    botName: botType,
                }),
            },
            senderKey: "",
            privateKey: "",
        });
        this.signAndSendMsg(msg);
    }

    findMatch(): Throwable<void> {
        const msg = new ArbitratorMessage({
            topic: "findMatch",
            contentType: MessageContentType.FIND_MATCH,
            content: {},
            senderKey: "",
            privateKey: "",
        })
        this.signAndSendMsg(msg);
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
        this.signAndSendMsg(msg);
    }
}
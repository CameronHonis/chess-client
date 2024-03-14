import {BotType} from "../models/domain/bot_type";
import {Throwable} from "../types";
import {ArbitratorMessageEventPayload} from "../models/events/message_event";
import {parseEventName} from "../models/events/message_event_name";
import {Move} from "../models/domain/move";
import {ArbitratorMessage} from "../models/api/messages/arbitrator_message";
import {MessageContentType} from "../models/api/messages/message_content_type";
import {ApiTimeControl} from "../models/api/time_control";
import {AuthKeyset} from "../models/domain/auth_keyset";
import {Challenge} from "../models/domain/challenge";
import {TimeControl} from "../models/domain/time_control";
import {sleep} from "../helpers/sleep";
import {dispatchDisconnectedEvent} from "../models/events/disconnected_event";
import {dispatchConnectedEvent} from "../models/events/connected_event";
import {getSecret, Secret} from "../helpers/secrets";

export class ArbitratorClient {
    readonly wsUrl: string;
    websocket: WebSocket;
    auth: AuthKeyset | null = null;

    constructor() {
        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        let location: string;
        const domain = getSecret(Secret.ARBITRATOR_DOMAIN);
        try {
            const port = getSecret(Secret.ARBITRATOR_PORT);
            location = `${domain}:${port}`;
        } catch {
            location = domain;
        }
        this.wsUrl = `${protocol}://${location}`;
        this.websocket = new WebSocket(this.wsUrl);
        this._attachWsHandlers();
    }

    setAuth(auth: AuthKeyset) {
        this.auth = auth;
    }

    refreshAuth(existingAuth?: AuthKeyset): Throwable<void> {
        const msg = ArbitratorMessage.withContent(MessageContentType.REFRESH_AUTH, {
            existingAuth: existingAuth,
        });
        this.sendMsg(msg);
    }

    challengePlayer(playerKey: string, isWhite: boolean, isBlack: boolean, timeControl: ApiTimeControl): Throwable<void> {
        if (!this.auth)
            throw new Error("cannot send challenge, auth not set");
        const msg = ArbitratorMessage.withContent(MessageContentType.CHALLENGE_REQUEST, {
            challenge: {
                uuid: "",
                challengerKey: this.auth.publicKey,
                challengedKey: playerKey,
                isChallengerWhite: isWhite,
                isChallengerBlack: isBlack,
                timeControl: timeControl,
                botName: "",
                timeCreated: new Date(),
                isActive: true,
            },
        });
        this.signAndSendMsg(msg);
    }

    challengeBot(botType: BotType, isWhite: boolean, isBlack: boolean, timeControl: ApiTimeControl): Throwable<void> {
        if (!this.auth)
            throw new Error("cannot send challenge, auth not set");
        const msg = ArbitratorMessage.withContent(MessageContentType.CHALLENGE_REQUEST, {
            challenge: {
                uuid: "",
                challengerKey: this.auth.publicKey,
                challengedKey: "",
                isChallengerWhite: isWhite,
                isChallengerBlack: isBlack,
                timeControl: timeControl,
                botName: botType,
                timeCreated: new Date(),
                isActive: true,
            },
        });
        this.signAndSendMsg(msg);
    }

    declineChallenge(challengerKey: string): Throwable<void> {
        const msg = ArbitratorMessage.withContent(MessageContentType.DECLINE_CHALLENGE, {
            challengerClientKey: challengerKey,
        });
        this.signAndSendMsg(msg);
    }

    acceptChallenge(challengerKey: string): Throwable<void> {
        const msg = ArbitratorMessage.withContent(MessageContentType.ACCEPT_CHALLENGE, {
            challengerClientKey: challengerKey,
        });
        this.signAndSendMsg(msg);
    }

    revokeChallenge(challengedKey: string): Throwable<void> {
        const msg = ArbitratorMessage.withContent(MessageContentType.REVOKE_CHALLENGE, {
            challengedClientKey: challengedKey,
        });
        this.signAndSendMsg(msg);
    }

    joinMatchmaking(timeControl: TimeControl): Throwable<void> {
        const msg = ArbitratorMessage.withContent(MessageContentType.JOIN_MATCHMAKING, {timeControl});
        this.signAndSendMsg(msg);
    }

    leaveMatchmaking(): Throwable<void> {
        const msg = ArbitratorMessage.withContent(MessageContentType.LEAVE_MATCHMAKING, {});
        this.signAndSendMsg(msg);
    }

    sendMove(matchId: string, move: Move): Throwable<void> {
        const msg = ArbitratorMessage.withContent(MessageContentType.MOVE, {
            matchId,
            move: JSON.parse(JSON.stringify(move)),
        });
        this.signAndSendMsg(msg);
    }

    resignMatch(matchId: string): Throwable<void> {
        const msg = ArbitratorMessage.withContent(MessageContentType.RESIGN_MATCH, {
            matchId,
        });
        this.signAndSendMsg(msg);
    }

    private _attachWsHandlers() {
        this.websocket.onopen = (e) => this._handleOpen(e);
        this.websocket.onmessage = (e) => this._handleMessage(e);
        this.websocket.onclose = (e) => this._handleClose(e);
        this.websocket.onerror = (e) => this._handleErr(e);
    }

    private _handleOpen(e: Event) {
        const url = (e.currentTarget as WebSocket).url;
        console.log(`websocket connection established with websocket on ${url}`);
        dispatchConnectedEvent(this.wsUrl);

        const existingAuth = AuthKeyset.fromLocalStorage("appState.auth");
        window.services.arbitratorClient.refreshAuth(existingAuth);
    }

    private _handleMessage(e: MessageEvent): Throwable<void> {
        if (typeof e.data !== "string") {
            console.warn(`Flushing unhandled websocket data type: ${typeof e.data}`);
            return;
        }
        const url = (e.currentTarget as WebSocket).url;
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

    private _handleClose(_: CloseEvent) {
        dispatchDisconnectedEvent(this.wsUrl);
        sleep(1000).then(() => {
            this._retryConnection();
        });
    }

    private _handleErr(_: Event) {
    }

    private _retryConnection() {
        this.websocket = new WebSocket(this.wsUrl);
        this._attachWsHandlers();
    }

    private signAndSendMsg(msg: ArbitratorMessage<any>): Throwable<void> {
        if (!this.auth)
            throw new Error("cannot sign message, auth not set");
        const signedMsg = this.auth.sign(msg);

        if (this.websocket.readyState !== 1) {
            throw new Error(`cannot send message, websocket not open. got readyState = ${this.websocket.readyState}`);
        }
        return this.sendMsg(signedMsg);
    }

    private sendMsg(msg: ArbitratorMessage<any>): Throwable<void> {
        const stringifiedMsg = JSON.stringify(msg);
        console.log(`[${this.websocket.url}] << ${stringifiedMsg}`);
        this.websocket.send(stringifiedMsg);
    }
}
import {ArbitratorClient} from "./services/arbitrator_client";
import {MessageContentType} from "./models/messages/message_content_type";
import {Timer} from "./services/timer";
import {AppState} from "./models/domain/app_state";
import {AppStateAction} from "./models/actions/app_state_action";
import React from "react";
import {BoardAnimator} from "./services/board_animator";
import {ArbitratorMessageEvent} from "./models/events/message_event";
import {MessageEventName} from "./models/events/message_event_name";
import {NotifAnimator} from "./services/notif_animator";
import {NOTIF_EVENT, NotifEvent} from "./models/events/notif_event";
import {DISCONNECTED_EVENT, DisconnectedEvent} from "./models/events/disconnected_event";
import {CONNECTED_EVENT, ConnectedEvent} from "./models/events/connected_event";

declare global {
    interface Document {
        addEventListener<CT extends MessageContentType>(type: MessageEventName<CT>, listener: (this: HTMLElement, ev: ArbitratorMessageEvent<CT>) => void): void;
        addEventListener(type: NOTIF_EVENT, listener: (this: HTMLElement, ev: NotifEvent) => void): void;
        addEventListener(type: DISCONNECTED_EVENT, listener: (this: HTMLElement, ev: DisconnectedEvent) => void): void;
        addEventListener(type: CONNECTED_EVENT, listener: (this: HTMLElement, ev: ConnectedEvent) => void): void;

        dispatchEvent<CT extends keyof typeof MessageContentType>(ev: ArbitratorMessageEvent<CT>): void;
        dispatchEvent(ev: NotifEvent): void;
        dispatchEvent(ev: DisconnectedEvent): void;
        dispatchEvent(ev: ConnectedEvent): void;

        removeEventListener<CT extends keyof MessageContentType>(type: MessageEventName<CT>, listener: (this: HTMLElement, ev: ArbitratorMessageEvent<CT>) => void): void;
        removeEventListener(type: NOTIF_EVENT, listener: (this: HTMLElement, ev: NotifEvent) => void): void;
        removeEventListener(type: DISCONNECTED_EVENT, listener: (this: HTMLElement, ev: DisconnectedEvent) => void): void;
        removeEventListener(type: CONNECTED_EVENT, listener: (this: HTMLElement, ev: ConnectedEvent) => void): void;
    }

    interface Window {
        appState: AppState;
        appDispatch: React.Dispatch<AppStateAction>;
        services: {
            arbitratorClient: ArbitratorClient;
            timer: Timer;
            boardAnimator: BoardAnimator;
            notifAnimator: NotifAnimator;
        };
    }
}
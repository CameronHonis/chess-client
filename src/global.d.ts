import {ArbitratorClient} from "./services/arbitrator_client";
import {AuthManager} from "./services/auth_manager";
import {MessageContentType} from "./models/messages/message_content_type";
import {Timer} from "./services/timer";
import {AppState} from "./models/state/app_state";
import {AppStateAction} from "./models/actions/app_state_action";
import React from "react";
import {BoardAnimator} from "./services/board_animator";
import {InboundArbitratorMessage} from "./models/events/message_event";
import {MessageEventName} from "./models/events/message_event_name";

declare global {
    interface Document {
        addEventListener<CT extends keyof typeof MessageContentType>(type: MessageEventName<CT>, listener: (this: HTMLElement, ev: InboundArbitratorMessage<CT>) => void): void;

        dispatchEvent<CT extends keyof typeof MessageContentType>(ev: InboundArbitratorMessage<CT>): void;

        removeEventListener<CT extends keyof MessageContentType>(type: MessageEventName<CT>, listener: (this: HTMLElement, ev: InboundArbitratorMessage<CT>) => void): void;
    }

    interface Window {
        appState: AppState;
        appDispatch: React.Dispatch<AppStateAction>;
        services: {
            authManager: AuthManager;
            arbitratorClient: ArbitratorClient;
            timer: Timer;
            boardAnimator: BoardAnimator
        }
    }
}
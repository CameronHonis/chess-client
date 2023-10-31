import {ArbitratorClient} from "./services/arbitrator_client";
import {AuthManager} from "./services/auth_manager";
import {ArbitratorMessageEvent} from "./models/events/arbitrator_message_event";

interface ArbitratorMessageEventMap {
    "arbitratorMessage-AUTH": ArbitratorMessageEvent
}

declare global {
    interface HTMLElement {
        addEventListener<K extends keyof ArbitratorMessageEventMap>(type: K, listener: (this: HTMLElement, ev: ArbitratorMessageEventMap[K]) => void): void;
        dispatchEvent<K extends keyof ArbitratorMessageEventMap>(ev: ArbitratorMessageEventMap[K]): void;
    }

    interface Window {
        services: {
            authManager: AuthManager;
            arbitratorClient: ArbitratorClient;
        }
    }
}
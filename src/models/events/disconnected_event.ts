export const DISCONNECTED_EVENT = "disconnected_event";
export type DISCONNECTED_EVENT = typeof DISCONNECTED_EVENT;
export interface DisconnectedEventPayload {
    url: string;
}
export type DisconnectedEvent = CustomEvent<DisconnectedEventPayload>;

export function dispatchDisconnectedEvent(url: string) {
    document.dispatchEvent(new CustomEvent(DISCONNECTED_EVENT, {
        detail: { url },
    }));
}
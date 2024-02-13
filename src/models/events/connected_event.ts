export const CONNECTED_EVENT = "connected_event";
export type CONNECTED_EVENT = typeof CONNECTED_EVENT;
export interface ConnectedEventPayload {
    url: string;
}
export type ConnectedEvent = CustomEvent<ConnectedEventPayload>;

export function dispatchConnectedEvent(url: string) {
    document.dispatchEvent(new CustomEvent(CONNECTED_EVENT, {
        detail: { url },
    }));
}
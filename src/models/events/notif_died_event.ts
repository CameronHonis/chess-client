import {Notification} from "../domain/notification";

export const NOTIF_DIED_EVENT = "notif";
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type NOTIF_DIED_EVENT = typeof NOTIF_DIED_EVENT;

export interface NotifDiedEventPayload {
    notif: Notification;
}

export type NotifDiedEvent = CustomEvent<NotifDiedEventPayload>;
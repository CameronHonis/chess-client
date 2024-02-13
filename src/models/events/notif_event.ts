import {Notification, NotifType} from "../domain/notification";

export const NOTIF_EVENT = "notif";
export type NOTIF_EVENT = typeof NOTIF_EVENT;

export interface NotifEventPayload {
    notif: Notification;
}

export type NotifEvent = CustomEvent<NotifEventPayload>;

export function dispatchNotif(notif: Notification) {
    document.dispatchEvent(new CustomEvent<NotifEventPayload>(NOTIF_EVENT, {
        detail: {
            notif: notif,
        }
    }));
}

export function dispatchErr(msg: string) {
    const notif = new Notification({type: NotifType.ERROR, msg: msg});
    document.dispatchEvent(new CustomEvent<NotifEventPayload>(NOTIF_EVENT, {
        detail: {
            notif,
        },
    }));
}

export function dispatchWarn(msg: string) {
    const notif = new Notification({type: NotifType.WARN, msg: msg});
    document.dispatchEvent(new CustomEvent<NotifEventPayload>(NOTIF_EVENT, {
        detail: {
            notif,
        },
    }));
}

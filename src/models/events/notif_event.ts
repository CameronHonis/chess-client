import {Notification, NotifType} from "../state/notification";

export type NOTIF_EVENT = "notif";
export const NOTIF_EVENT = "notif";

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

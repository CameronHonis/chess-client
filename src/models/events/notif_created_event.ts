import {Notification, NotifType} from "../domain/notification";

export const NOTIF_CREATED_EVENT = "notif_created";
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type NOTIF_CREATED_EVENT = typeof NOTIF_CREATED_EVENT;

export interface NotifCreatedEventPayload {
    notif: Notification;
}

export type NotifCreatedEvent = CustomEvent<NotifCreatedEventPayload>;

export function dispatchNotif(notif: Notification) {
    document.dispatchEvent(new CustomEvent<NotifCreatedEventPayload>(NOTIF_CREATED_EVENT, {
        detail: {
            notif: notif,
        }
    }));
}

export function dispatchErr(msg: string) {
    const notif = Notification.new(NotifType.ERROR, msg);
    document.dispatchEvent(new CustomEvent<NotifCreatedEventPayload>(NOTIF_CREATED_EVENT, {
        detail: {
            notif,
        },
    }));
}

export function dispatchWarn(msg: string) {
    const notif = Notification.new(NotifType.WARN, msg);
    document.dispatchEvent(new CustomEvent<NotifCreatedEventPayload>(NOTIF_CREATED_EVENT, {
        detail: {
            notif,
        },
    }));
}

//@ts-ignore
window.dispatchErr = dispatchErr;
//@ts-ignore
window.dispatchWarn = dispatchWarn;
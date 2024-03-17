import React from "react";
import {Notification, NotifType} from "../models/domain/notification";
import {NOTIF_CREATED_EVENT, NotifCreatedEvent} from "../models/events/notif_created_event";

import "../styles/notif.css";
import {useTimedQueue} from "../hooks/use_timed_queue";

const DEFAULT_NOTIF_EXPIRE_MS = 5000;

export const NotifsOverlay: React.FC = () => {
    const [notifs, addNotif] = useTimedQueue<Notification>(DEFAULT_NOTIF_EXPIRE_MS);

    React.useEffect(() => {
        const handleNotifEvent = (ev: NotifCreatedEvent) => {
            addNotif(ev.detail.notif);
        }
        document.addEventListener(NOTIF_CREATED_EVENT, handleNotifEvent);

        return () => document.removeEventListener(NOTIF_CREATED_EVENT, handleNotifEvent);
    }, [addNotif]);

    const notifEles = React.useMemo(() => {
        return notifs.reverse().map((notif, idx) => {
            const classNames = ["Notif"];
            if (notif.type === NotifType.WARN)
                classNames.push("Warn");
            if (notif.type === NotifType.ERROR)
                classNames.push("Error");
            return <div className={classNames.join(" ")} key={idx}>{notif.msg}</div>
        });
    }, [notifs]);
    return (
        <div className={"Notifs"}>
            {notifEles}
        </div>
    )
}
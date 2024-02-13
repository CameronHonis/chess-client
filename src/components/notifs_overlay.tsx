import React from "react";
import {EasyQueue} from "../helpers/easy_queue";
import {Notification, NotifType} from "../models/domain/notification";
import "../styles/notif.css";
import {NOTIF_EVENT, NotifEvent} from "../models/events/notif_event";
import {sleep} from "../helpers/sleep";

export const NotifsOverlay: React.FC<{}> = (props) => {
    const [notifQueue, setNotifQueue] = React.useState(new EasyQueue<Notification>());

    const pushQueue = React.useCallback((notif: Notification) => {
        notifQueue.push(notif);
        setNotifQueue(notifQueue.copy());
        if (notifQueue.size() === 1) {
            window.services.notifAnimator.startNewNotifAnim();
        }
    }, [notifQueue, setNotifQueue]);

    React.useEffect(() => {
        const handleNotifEvent = (ev: NotifEvent) => {
            pushQueue(ev.detail.notif);
        }
        document.addEventListener(NOTIF_EVENT, handleNotifEvent);
        if (notifQueue.size() > 0) {
            window.services.notifAnimator.startNewNotifAnim();
        }

        return () => document.removeEventListener(NOTIF_EVENT, handleNotifEvent);
    });

    React.useEffect(() => {
        (async () => {
            await sleep(5000);
            if (notifQueue.size() > 0) {
                notifQueue.pop();
                setNotifQueue(notifQueue.copy());
                window.services.notifAnimator.startNewNotifAnim();
            }
        })();
    }, [notifQueue, setNotifQueue]);

    const notif = notifQueue.size() ? notifQueue.first() : null;
    if (!notif) {
        return null
    }
    let bgColor;
    if (notif.type === NotifType.WARN) {
        bgColor = "#BBBB44";
    } else if (notif.type === NotifType.ERROR) {
        bgColor = "red";
    }
    return (
        <div className={"NotifBanner"} style={{background: bgColor}}>
            {notif.msg}
        </div>
    )
}
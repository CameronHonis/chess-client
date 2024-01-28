import React from "react";
import {EasyQueue} from "../helpers/easy_queue";
import {Notification, NotifType} from "../models/state/notification";
import "../styles/notif.css";
import {NOTIF_EVENT} from "../models/events/notif_event";

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
        document.addEventListener(NOTIF_EVENT, (ev) => {
            pushQueue(ev.detail.notif);
        });
        if (notifQueue.size() > 0) {
            window.services.notifAnimator.startNewNotifAnim();
        }
    });

    React.useEffect(() => {
        setTimeout(() => {
            if (notifQueue.size() > 0) {
                notifQueue.pop();
                setNotifQueue(notifQueue.copy());
                window.services.notifAnimator.startNewNotifAnim();
            }
        }, 5000);
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
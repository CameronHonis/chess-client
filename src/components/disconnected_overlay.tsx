import React from "react";
import {DISCONNECTED_EVENT, DisconnectedEvent} from "../models/events/disconnected_event";
import {CONNECTED_EVENT, ConnectedEvent} from "../models/events/connected_event";
import "../styles/disconnected_overlay.css";
import {DisconnectedOverlayAnimator} from "../services/disconnected_overlay_animator";

export function DisconnectedOverlay() {
    const overlayRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!overlayRef.current)
            return
        const animator = new DisconnectedOverlayAnimator(overlayRef.current);
        const handleDisconnectedEvent = (_: DisconnectedEvent) => {
            animator.setDisconnected();
        }

        const handleConnectedEvent = (_: ConnectedEvent) => {
            animator.setConnected();
        }

        document.addEventListener(DISCONNECTED_EVENT, handleDisconnectedEvent);
        document.addEventListener(CONNECTED_EVENT, handleConnectedEvent);

        return () => {
            document.removeEventListener(DISCONNECTED_EVENT, handleDisconnectedEvent);
            document.removeEventListener(CONNECTED_EVENT, handleConnectedEvent);
        }
    }, [overlayRef]);

    return <>
        <div ref={overlayRef}>
            <p>Trying to reconnect...</p>
        </div>
    </>
}
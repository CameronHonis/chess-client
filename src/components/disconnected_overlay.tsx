import React from "react";
import {DISCONNECTED_EVENT, DisconnectedEvent} from "../models/events/disconnected_event";
import {CONNECTED_EVENT, ConnectedEvent} from "../models/events/connected_event";
import "../styles/disconnected_overlay.css";

export function DisconnectedOverlay() {
    const [isConnected, setIsConnected] = React.useState(true);

    React.useEffect(() => {
        const handleDisconnectedEvent = (_: DisconnectedEvent) => {
            setIsConnected(false);
        }

        const handleConnectedEvent = (_: ConnectedEvent) => {
            setIsConnected(true);
        }

        document.addEventListener(DISCONNECTED_EVENT, handleDisconnectedEvent);
        document.addEventListener(CONNECTED_EVENT, handleConnectedEvent);

        return () => {
            document.removeEventListener(DISCONNECTED_EVENT, handleDisconnectedEvent);
            document.removeEventListener(CONNECTED_EVENT, handleConnectedEvent);
        }
    }, [setIsConnected]);

    React.useEffect(() => {
        if (!isConnected) {

        }
    }, [isConnected]);

    return <>
        {!isConnected &&
        <div className={"DisconnectedOverlay"}>
            <p>Trying to reconnect...</p>
        </div>}
    </>
}
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./styles/index.css";
import App from './App';
import {ArbitratorClient} from "./services/arbitrator_client";
import {AuthManager} from "./services/auth_manager";
import {Timer} from "./services/timer";
import {BoardAnimator} from "./services/board_animator";
import {NotifAnimator} from "./services/notif_animator";

window.services = {
    arbitratorClient: new ArbitratorClient(),
    authManager: new AuthManager(),
    timer: new Timer(),
    boardAnimator: new BoardAnimator(),
    notifAnimator: new NotifAnimator(),
};

// TEMPORARY
window.services.authManager.setArbitratorKeyset({
    publicKey: "whiteClientId",
    privateKey: "whitePrivateKey",
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <App/>
);
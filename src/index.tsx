import React from 'react';
import ReactDOM from 'react-dom/client';
import "./styles/index.css";
import App from './App';
import {ArbitratorClient} from "./services/arbitrator_client";
import {AuthManager} from "./services/auth_manager";

window.services = {
    arbitratorClient: new ArbitratorClient(),
    authManager: new AuthManager(),
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <App/>
);
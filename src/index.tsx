import React from 'react';
import ReactDOM from 'react-dom/client';
import "./styles/index.css";
import App from './App';
import {ArbitratorClient} from "./services/arbitrator_client";

window.services = {
    arbitratorClient: new ArbitratorClient(),
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <App/>
);
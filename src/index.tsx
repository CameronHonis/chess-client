import React from 'react';
import ReactDOM from 'react-dom/client';
import "./styles/index.css";
import App from './App';
import {ArbitratorClient} from "./services/arbitrator_client";
import {Timer} from "./services/timer";
import {BoardAnimator} from "./services/board_animator";
import {NotifAnimator} from "./services/notif_animator";
import {registerOnChallengeFailedMsgHandler} from "./helpers/arbitrator_handlers";
import {BoardState} from './models/domain/board_state';
import {Match} from "./models/domain/match";
import {Move} from "./models/domain/move";
import {Challenge} from "./models/domain/challenge";
import {ChessPiece} from "./models/domain/chess_piece";
import {Square} from "./models/domain/square";
import {ArbitratorMessage} from "./models/api/messages/arbitrator_message";

window.services = {
    arbitratorClient: new ArbitratorClient(),
    timer: new Timer(),
    boardAnimator: new BoardAnimator(),
    notifAnimator: new NotifAnimator(),
};

// @ts-ignore
window.models = {
    BoardState,
    Match,
    Move,
    Challenge,
    ChessPiece,
    Square,
    ArbitratorMessage,
}

registerOnChallengeFailedMsgHandler();

// // TEMPORARY
// window.services.authManager.setArbitratorKeyset({
//     publicKey: "whiteClientId",
//     privateKey: "whitePrivateKey",
// });

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <App/>
);
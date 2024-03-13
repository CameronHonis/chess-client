import React from 'react';
import {Header} from "./components/header";
import "./styles/app.css";
import {AppState} from "./models/domain/app_state";
import {appStateReducer} from "./reducers/app_state_reducer";
import {AppStateAction} from "./models/actions/app/app_state_action";
import {Page} from "./models/domain/page";
import {NotifsOverlay} from "./components/notifs_overlay";
import {
    registerOnAuthMsgHandler,
    registerOnChallengeUpdatedMsgHandler,
    registerOnMatchUpdatedMsgHandler,
    registerOnMoveMsgHandler
} from "./helpers/arbitrator_handlers";
import {ChallengesOverlay} from "./components/challenges/challenges_overlay";
import {Home} from "./components/home";
import {DisconnectedOverlay} from "./components/disconnected_overlay";
import {MatchFC} from './components/match_fc';
import {AuthKeyset} from "./models/domain/auth_keyset";
import {Match} from "./models/domain/match";
import {Board} from "./models/domain/board";
import {Move} from "./models/domain/move";
import {ChessPiece} from "./models/domain/chess_piece";
import {Square} from "./models/domain/square";
import {newRapidTimeControl} from "./models/domain/time_control";
import {MatchResult} from "./models/domain/match_result";


const initAppState = new AppState({
    auth: new AuthKeyset({
        publicKey: "white-client-key",
        privateKey: "some-private-key",
    }),
    page: Page.MATCH,
    match: new Match({
        uuid: "some-uuid",
        board: Board.fromFEN("r7/6P1/1k6/8/8/8/8/6RK b - - 1 63"),
        lastMove: new Move(ChessPiece.BLACK_ROOK, new Square(7, 1), new Square(8, 1), [], ChessPiece.EMPTY, ChessPiece.EMPTY),
        whiteTimeRemainingSec: 44.7,
        whiteClientKey: "white-client-key",
        blackTimeRemainingSec: 93.6,
        blackClientKey: "black-client-key",
        timeControl: newRapidTimeControl(),
        botName: "",
        result: MatchResult.IN_PROGRESS,
    }),
    // auth: null,
    // page: Page.HOME,
    // match: null,
    lastMove: null,
    inboundChallenges: [],
    outboundChallenges: [],
});
// const appState = AppState.fromLocalStorage("appState");

export const appStateContext = React.createContext<[AppState, React.Dispatch<AppStateAction>]>([initAppState, () => {
}]);

function App() {
    const [state, dispatch] = React.useReducer(appStateReducer, initAppState);

    React.useEffect(() => {
        window.appState = state;
        window.appDispatch = dispatch;

        state.toLocalStorage("appState");
    }, [state, dispatch]);

    React.useEffect(() => {
        registerOnAuthMsgHandler(dispatch);
        registerOnMatchUpdatedMsgHandler(dispatch);
        registerOnMoveMsgHandler(dispatch);
        registerOnChallengeUpdatedMsgHandler(dispatch);

    }, []);

    return (
        <div className="App">
            <appStateContext.Provider value={[state, dispatch]}>
                <Header/>
                <DisconnectedOverlay/>
                <NotifsOverlay/>
                <ChallengesOverlay/>
                {state.page === Page.HOME && <Home/>}
                {state.page === Page.MATCH &&
                    <MatchFC match={state.match!} isLocked={false} viewingClientKey={state.auth!.publicKey}/>}
            </appStateContext.Provider>
        </div>
    );
}

export default App;

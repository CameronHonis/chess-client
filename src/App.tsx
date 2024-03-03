import React from 'react';
import {Header} from "./components/header";
import {Board} from "./components/board";
import "./styles/app.css";
import {AppState} from "./models/domain/app_state";
import {appStateReducer} from "./reducers/app_state_reducer";
import {AppStateAction} from "./models/actions/app_state_action";
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
import {AuthKeyset} from "./models/domain/auth_keyset";

export const appStateContext = React.createContext<[AppState, React.Dispatch<AppStateAction>]>([new AppState({}), () => {
}]);

function App() {
    const [state, dispatch] = React.useReducer(appStateReducer, AppState.fromLocalStorage("appState"));

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
                <DisconnectedOverlay />
                <NotifsOverlay/>
                <ChallengesOverlay/>
                {state.page === Page.HOME && <Home/>}
                {state.page === Page.BOARD && <Board/>}
            </appStateContext.Provider>
        </div>
    );
}

export default App;

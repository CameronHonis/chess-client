import React from 'react';
import {MatchPicker} from "./components/match_picker/match_picker";
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

export const appStateContext = React.createContext<[AppState, React.Dispatch<AppStateAction>]>([new AppState({}), () => {
}]);

function App() {
    const [state, dispatch] = React.useReducer(appStateReducer, new AppState({}));

    React.useEffect(() => {
        window.appState = state;
        window.appDispatch = dispatch;
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
                <NotifsOverlay/>
                <ChallengesOverlay/>
                {state.page === Page.HOME && <Home/>}
                {state.page === Page.BOARD && <Board/>}
            </appStateContext.Provider>
        </div>
    );
}

export default App;

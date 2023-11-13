import React from 'react';
import {MatchPicker} from "./components/match_picker/match_picker";
import {Header} from "./components/header";
import {MessageEventName} from "./models/enums/message_event_name";
import {Board} from "./components/board";
import "./styles/app.css";
import {AppState, initAppState} from "./models/state/app_state";
import {appStateReducer} from "./reducers/app_state_reducer";
import {MatchUpdateReceived} from "./models/actions/match_update_received";
import {AppStateAction} from "./models/actions/app_state_action";
import {Page} from "./models/enums/page";

export const appStateContext = React.createContext<[AppState, React.Dispatch<AppStateAction>]>([initAppState, () => {}]);

function App() {
    const [state, dispatch] = React.useReducer(appStateReducer, initAppState);
    React.useEffect(() => {
        window.appState = state;
        window.appDispatch = dispatch;
    }, [state, dispatch]);

    React.useEffect(() => {
        document.addEventListener(MessageEventName.MATCH_UPDATE, (e) => {
            dispatch(new MatchUpdateReceived({
                newMatch: e.detail.msg.content.match,
            }));
        });
    }, []);

    return (
        <div className="App">
            <appStateContext.Provider value={[state, dispatch]}>
                <Header />
                {state.page === Page.HOME && <MatchPicker />}
                {state.page === Page.BOARD && <Board />}
            </appStateContext.Provider>
        </div>
    );
}

export default App;

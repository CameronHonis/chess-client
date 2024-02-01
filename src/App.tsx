import React from 'react';
import {MatchPicker} from "./components/match_picker/match_picker";
import {Header} from "./components/header";
import {Board} from "./components/board";
import "./styles/app.css";
import {AppState} from "./models/state/app_state";
import {appStateReducer} from "./reducers/app_state_reducer";
import {AppStateAction} from "./models/actions/app_state_action";
import {Page} from "./models/state/page";
import {NotifsOverlay} from "./components/notifs_overlay";
import {registerOnChallengeFailed, registerOnMatchUpdatedMsg, registerOnMoveMsg} from "./helpers/arbitrator_handlers";

export const appStateContext = React.createContext<[AppState, React.Dispatch<AppStateAction>]>([new AppState({}), () => {
}]);

function App() {
    const [state, dispatch] = React.useReducer(appStateReducer, new AppState({}));
    React.useEffect(() => {
        window.appState = state;
        window.appDispatch = dispatch;
    }, [state, dispatch]);

    React.useEffect(() => {
        document.addEventListener(parseEventName(MessageContentType.MATCH_UPDATED), (e) => {
            const newMatch = e.detail.msg.content.match;
            dispatch(new MatchUpdateReceived(newMatch));
        });
        document.addEventListener(parseEventName(MessageContentType.MOVE), (e) => {
            const move = e.detail.msg.content.move;
            window.services.boardAnimator.movePiece(move.startSquare, move.endSquare);
            dispatch(new MoveReceived(move));
        });
    }, []);

    return (
        <div className="App">
            <appStateContext.Provider value={[state, dispatch]}>
                <Header/>
                <NotifsOverlay/>
                {state.page === Page.HOME && <MatchPicker/>}
                {state.page === Page.BOARD && <Board/>}
            </appStateContext.Provider>
        </div>
    );
}

export default App;

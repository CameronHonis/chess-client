import React from 'react';
import {MatchPicker} from "./components/match_picker/match_picker";
import {Header} from "./components/header";
import {MessageEventName} from "./models/enums/message_event_name";
import {Match} from "./models/match";
import {Board} from "./components/board";

export enum Page {
    HOME = "HOME",
    BOARD = "BOARD"
}

export const matchContext = React.createContext<Match | null>(null);

function App() {
    const [match, setMatch] = React.useState<Match | null>(null);
    const [page, setPage] = React.useState<Page>(Page.HOME);

    React.useEffect(() => {
        document.addEventListener(MessageEventName.MATCH_UPDATE, (e) => {
            setMatch(e.detail.msg.content.match);
        });
    }, [])

    React.useEffect(() => {
        if (match === null) {
            setPage(Page.HOME);
        } else {
            setPage(Page.BOARD);
        }
    }, [match]);

    return (
        <div className="App">
            <matchContext.Provider value={match}>
                <Header/>
                {page === Page.HOME && <MatchPicker/>}
                {page === Page.BOARD && <Board/>}
            </matchContext.Provider>
        </div>
    );
}

export default App;

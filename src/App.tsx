import React from 'react';
import {MatchPicker} from "./components/match_picker/match_picker";
import {Header} from "./components/header";
import {MessageEventName} from "./models/enums/message_event_name";
import {Match} from "./models/match";
import {Board} from "./components/board";
import "./styles/app.css";

export enum Page {
    HOME = "HOME",
    BOARD = "BOARD"
}

export const matchContext = React.createContext<Match | null>(null);

function App() {
    const [match, setMatch] = React.useState<Match | null>(null);
    const [page, setPage] = React.useState<Page>(Page.HOME);
    const headerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        document.addEventListener(MessageEventName.MATCH_UPDATE, (e) => {
            setMatch(e.detail.msg.content.match);
        });
    }, [])

    React.useEffect(() => {
        if (match === null) {
            setPage(Page.HOME);
        } else {
            window.services.timer.setFromMatch(match);
            setPage(Page.BOARD);
        }
    }, [match]);

    return (
        <div className="App">
            <matchContext.Provider value={match}>
                <Header headerRef={headerRef} />
                {page === Page.HOME && <MatchPicker />}
                {page === Page.BOARD && match && <Board header={headerRef.current}/>}
            </matchContext.Provider>
        </div>
    );
}

export default App;

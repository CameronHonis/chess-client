import React from 'react';
import {MatchPicker} from "./components/match_picker/match_picker";
import {Header} from "./components/header";
import {MessageEventName} from "./models/enums/message_event_name";
import {Match} from "./models/match";
import {Board} from "./components/board";
import "./styles/app.css";
import {BoardState} from "./models/board_state";
import {TimeControl} from "./models/time_control";

export enum Page {
    HOME = "HOME",
    BOARD = "BOARD"
}

export const matchContext = React.createContext<Match | null>(null);

const board = BoardState.fromFEN("3k4/3Q4/3K4/8/8/8/8/8 b - - 0 1");
board.isTerminal = true;
const tempMatch = new Match({
    uuid: "asdf",
    board: board,
    whiteTimeRemaining: 10,
    whiteClientId: "whiteClientId",
    blackTimeRemaining: 10,
    blackClientId: "blackClientId",
    timeControl: new TimeControl({
        initialTimeSeconds: 600,
        incrementSeconds: 0,
        timeAfterMovesCount: 0,
        secondsAfterMoves: 0
    }),
});
function App() {
    const [match, setMatch] = React.useState<Match | null>(tempMatch);
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

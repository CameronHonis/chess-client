import React from 'react';
import {BoardFrame} from "./components/board_frame";
import {MatchPicker} from "./components/match_picker/match_picker";
import {Header} from "./components/header";

export enum Page {
    HOME="HOME",
    BOARD="BOARD"
}

function App() {
    const [page, setPage] = React.useState<Page>(Page.HOME);

    React.useEffect(() => {
        document.addEventListener("arbitratorMessage-MATCH_UPDATE", (e) => {
            setPage(Page.BOARD);
        });
    }, [])

    return (
        <div className="App">
            <Header />
            {page === Page.HOME && <MatchPicker/>}
            {page === Page.BOARD && <BoardFrame/>}
        </div>
    );
}

export default App;

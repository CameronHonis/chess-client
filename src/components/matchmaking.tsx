import React from "react";

type LoadingDots = "" | "." | ".." | "...";
export const Matchmaking: React.FC = () => {
    const [dots, setDots] = React.useState<LoadingDots>("");

    React.useEffect(() => {
        let loopCount = 0;
        const intervalId = window.setInterval(() => {
            const dotsBuilder: string[] = [];
            for (let i = 0; i < loopCount % 4; i++) {
                dotsBuilder.push(".");
            }
            setDots(dotsBuilder.join("") as LoadingDots);
            loopCount++;
        }, 500);
        return () => {
            window.clearInterval(intervalId);
        }
    }, [])
    return <div className="Matchmaking">
        <p>{`searching for match${dots}`}</p>
        <button>cancel</button>
    </div>

}
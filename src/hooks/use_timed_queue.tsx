import React from "react";
import {EasyQueue} from "../helpers/easy_queue";
import {Queue} from "../interfaces/queue";

export function useTimedQueue<T>(delayMs: number): [T[], (ele: T) => void] {
    const [allEles, setAllEles] = React.useState<T[]>([]);
    const queue = React.useRef<Queue<T>>(new EasyQueue());

    React.useEffect(() => {
        if (allEles.length) {
            const timeout = setTimeout(() => {
                queue.current.pop();
                setAllEles([...queue.current]);
            }, delayMs);
            return () => clearTimeout(timeout);
        }
    }, [allEles, delayMs]);

    const push = (ele: T) => {
        queue.current.push(ele);
        setAllEles([...queue.current]);
    }

    return [allEles, push];
}
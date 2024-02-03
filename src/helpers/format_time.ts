export function formatTimeForTimer(seconds: number): string {
    if (seconds >= 59) {
        let wholeMinutes = Math.floor(seconds / 60);
        let wholeSeconds = Math.ceil(seconds % 60);
        if (wholeSeconds === 60) {
            wholeMinutes++;
            wholeSeconds = 0;
        }
        return `${wholeMinutes}:${wholeSeconds >= 10 ? wholeSeconds : "0" + wholeSeconds}`;
    } else {
        let wholeSeconds = Math.floor(seconds);
        let wholeTenths = Math.ceil(10 * (seconds % 1));
        if (wholeTenths === 10) {
            wholeSeconds++;
            wholeTenths = 0;
        }
        return `${wholeSeconds >= 10 ? wholeSeconds : "0" + wholeSeconds}.${wholeTenths}`;
    }
}
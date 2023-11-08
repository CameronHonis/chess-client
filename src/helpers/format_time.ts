export function formatTimeForTimer(seconds: number): string {
    if (seconds >= 60) {
        const wholeMinutes = Math.floor(seconds / 60);
        let wholeSeconds = Math.ceil(seconds % 60);
        return `${wholeMinutes}:${wholeSeconds >= 10 ? wholeSeconds : "0" + wholeSeconds}`;
    } else {
        const wholeSeconds = Math.floor(seconds);
        const wholeTenths = Math.floor(10 * (seconds % 1));
        return `${wholeSeconds >= 10 ? wholeSeconds : "0" + wholeSeconds}.${wholeTenths}`;
    }
}
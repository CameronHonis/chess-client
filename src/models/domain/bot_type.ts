export enum BotType {
    RANDOM = "random",
    STOCKFISH = "stockfish",
    NOT_IMPLEMENTED = "not_implemented",
}

export function isBotType(s: string): s is BotType {
    return Object.values(BotType).includes(s as BotType);
}
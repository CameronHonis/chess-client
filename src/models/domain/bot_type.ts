export enum BotType {
    RANDOM = "random",
    NOT_IMPLEMENTED = "not_implemented",
}

export function isBotType(s: string): s is BotType {
    return Object.values(BotType).includes(s as BotType);
}
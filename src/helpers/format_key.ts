
export function formatKey(key: string): string {
    if (key.length < 8) {
        return key;
    }
    return `${key.slice(0, 3)}..${key.slice(key.length - 3)}`;
}
export interface Queue<T> {
    push(ele: T): void;
    pop(): T;
    first(): T;
    last(): T;
    size(): number;
    copy(): Queue<T>;
    [Symbol.iterator](): Iterator<T>;
    equalTo(other: Queue<T>): boolean;
}

export interface Queue<T> {
    push(ele: T): void;
    pop(): T;
    first(): T;
    last(): T;
    size(): number;
    flush(): void;
    copy(): Queue<T>;
    [Symbol.iterator](): Iterator<T>;
    equalTo(other: Queue<T>): boolean;
}

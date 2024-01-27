export interface Queue<T> {
    push(ele: T): void;
    pop(): T;
    first(): T;
    last(): T;
    size(): number;
}

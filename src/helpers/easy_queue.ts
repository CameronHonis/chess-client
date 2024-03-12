import {Queue} from "../interfaces/queue";
import {Throwable} from "../types";

export class EasyQueue<T> implements Queue<T> {
    private eles: T[];
    private firstIdx: number;

    constructor(...eles: T[]) {
        this.firstIdx = 0;
        this.eles = [...eles];
    }

    size(): number {
        return this.eles.length - this.firstIdx;
    }

    first(): Throwable<T> {
        if (this.size() === 0) {
            throw new RangeError("cannot get first element from empty queue");
        }
        return this.eles[this.firstIdx];
    }

    last(): Throwable<T> {
        if (this.size() === 0) {
            throw new RangeError("cannot get last element from empty queue");
        }
        return this.eles[this.eles.length - 1];
    }

    push(ele: T) {
        this.eles.push(ele);
    }

    pop(): Throwable<T> {
        const first = this.first();
        this.firstIdx++;

        if (this.firstIdx > this.eles.length / 2) {
            this.eles = this.eles.slice(this.firstIdx);
            this.firstIdx = 0;
        }

        return first;
    }

    copy(): EasyQueue<T> {
        return new EasyQueue(...this.eles.slice(this.firstIdx));
    }

    [Symbol.iterator](): Iterator<T> {
        let index = this.firstIdx;
        return {
            next: () => {
                if (index < this.eles.length) {
                    return {
                        value: this.eles[index++],
                        done: false
                    }
                } else {
                    return {
                        value: undefined,
                        done: true
                    }
                }
            }
        }
    }

    equalTo(other: Queue<T>): boolean {
        if (this.size() !== other.size())
            return false;
        let otherIdx = 0;
        for (let otherEle of other) {
            if (this.eleAt(otherIdx++) !== otherEle)
                return false;
        }
        return true;
    }

    private eleAt(idx: number): T | undefined {
        if (idx < 0 || idx >= this.size())
            return undefined;
        return this.eles[idx + this.firstIdx];
    }
}

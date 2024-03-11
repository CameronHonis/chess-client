import {Queue} from "../interfaces/queue";
import {Throwable} from "../types";

export class EasyQueue<T> implements Queue<T> {
    private _eles: T[];
    private firstIdx: number;

    constructor(...eles: T[]) {
        this.firstIdx = 0;
        this._eles = [...eles];
    }

    size(): number {
        return this._eles.length - this.firstIdx;
    }

    first(): Throwable<T> {
        if (this.size() === 0) {
            throw new RangeError("cannot get first element from empty queue");
        }
        return this._eles[this.firstIdx];
    }

    last(): Throwable<T> {
        if (this.size() === 0) {
            throw new RangeError("cannot get last element from empty queue");
        }
        return this._eles[this._eles.length - 1];
    }

    push(ele: T) {
        this._eles.push(ele);
    }

    pop(): Throwable<T> {
        const first = this.first();
        this.firstIdx++;

        if (this.firstIdx > this._eles.length / 2) {
            this._eles = this._eles.slice(this.firstIdx);
            this.firstIdx = 0;
        }

        return first;
    }

    copy(): EasyQueue<T> {
        return new EasyQueue(...this._eles.slice(this.firstIdx));
    }

    [Symbol.iterator](): Iterator<T> {
        let index = this.firstIdx;
        return {
            next: () => {
                if (index < this._eles.length) {
                    return {
                        value: this._eles[index++],
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
}

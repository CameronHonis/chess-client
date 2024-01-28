import {EasyQueue} from "../../src/helpers/easy_queue";

describe("EasyQueue", () => {
    let q: EasyQueue<number>;
    beforeEach(() => {
        q = new EasyQueue();
    });
    describe("::first", () => {
        describe("when the queue is empty", () => {
            it("throws a range error", () => {
                const q = new EasyQueue();
                expect(() => {
                    q.first();
                }).toThrow(RangeError);
            });
        });
        describe("when the queue has elements", () => {
            it("returns the first-in element", () => {
                const q = new EasyQueue();
                q.push(1);
                q.push(2);
                expect(q.first()).toBe(1);
            });
        });
    });
    describe("::last", () => {
        describe("when the queue is empty", () => {
            it("throws a range error", () => {
                const q = new EasyQueue();
                expect(() => {
                    q.last();
                }).toThrow(RangeError);
            });
        });
        describe("when the queue has multiple elements", () => {
            it("returns the last-in element", () => {
                const q = new EasyQueue();
                q.push(1);
                q.push(2);
                expect(q.last()).toBe(2);
            });
        });
    });
    describe("::pop", () => {
        describe("when the queue is empty", () => {
            it("throws a range error", () => {
                const q = new EasyQueue();
                expect(() => {
                    q.pop();
                }).toThrow(RangeError);
            });
        });
        describe("when the queue has multiple elements", () => {
            it("returns the first-in element", () => {
                const q = new EasyQueue();
                q.push(1);
                q.push(2);
                expect(q.last()).toBe(2);
            });
            it("updates the pointer to the first", () => {
                const q = new EasyQueue();
                q.push(1);
                q.push(2);
                q.push(3);
                q.pop();
                expect(q.first()).toBe(2);
            });
        });
        describe("when majority of initial queue is popped", () => {
            it("updates the first element pointer to the next element each time", () => {
                // specifically this tests that the array "collapses" correctly after it reaches the
                // "half-empty" threshold
                const q = new EasyQueue(1, 2, 3, 4, 5, 6, 7);
                for (let i = 0; i < 7; i++) {
                    expect(q.pop()).toBe(i + 1);
                }
            });
        });
    });
    describe("::copy", () => {
        beforeEach(() => {
            // cause the first element ptr to be > 0
           q.push(1);
           q.push(2);
           q.push(3);
           q.push(4);
           q.push(5);
           q.pop();
           q.pop();
        });
        it("creates an exact copy", () => {
            const q1 = q.copy();
            expect(q1).toBeInstanceOf(EasyQueue);
            expect(q1.size()).toBe(q.size());
            expect(q1.first()).toBe(q.first());
            expect(q1.last()).toBe(q.last());
            expect(q1 === q).toBe(false);
        });
    });
});
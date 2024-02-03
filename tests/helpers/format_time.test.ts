import {formatTimeForTimer} from "../../src/helpers/format_time";

describe("formatTimeForTimer", () => {
    describe("when the time is less than 10", () => {
        it("returns '0S.T'", () => {
            expect(formatTimeForTimer(5.5)).toBe("05.5");
        });
        describe("and the time ends with a 9", () => {
            it("rounds up the seconds", () => {
                expect(formatTimeForTimer(9.9)).toBe("10.0");
            });
        });
    });
    describe("when the time is exactly 10", () => {
        it("returns '10.0'", () => {
            expect(formatTimeForTimer(10)).toBe("10.0");
        });
    });
    describe("when the time is between 10 and 60", () => {
        describe("when the time is a whole number", () => {
            it("returns 'SS.0'", () => {
                expect(formatTimeForTimer(25)).toBe("25.0");
            });
        });
        describe("when the time is a decimal", () => {
            it("returns 'SS.T'", () => {
               expect(formatTimeForTimer(25.5)).toBe("25.5");
            });
        });
        describe("when the time is exactly 59.9", () => {
            it("returns '1:00'", () => {
                expect(formatTimeForTimer(59.9)).toBe("1:00");
            });
        });
    });
    describe("when the time is exactly 60", () => {
        it("returns '1:00'", () => {
            expect(formatTimeForTimer(60)).toBe("1:00");
        });
    });
    describe("when the time is greater than 60", () => {
        it("returns 'M:SS'", () => {
            expect(formatTimeForTimer(75)).toBe("1:15");
        });
    });
});
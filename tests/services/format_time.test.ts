import {ClockAnimator} from "../../src/services/clock_animator"

describe("ClockAnimator", () => {
    describe("#formatTime", () => {
        describe("when the time is less than 10", () => {
            it("returns '0S.T'", () => {
                expect(ClockAnimator.formatTime(5.5)).toBe("05.5");
            });
            describe("and the time ends with a 9", () => {
                it("rounds up the seconds", () => {
                    expect(ClockAnimator.formatTime(9.9)).toBe("10.0");
                });
            });
        });
        describe("when the time is exactly 10", () => {
            it("returns '10.0'", () => {
                expect(ClockAnimator.formatTime(10)).toBe("10.0");
            });
        });
        describe("when the time is between 10 and 60", () => {
            describe("when the time is a whole number", () => {
                it("returns 'SS.0'", () => {
                    expect(ClockAnimator.formatTime(25)).toBe("25.0");
                });
            });
            describe("when the time is a decimal", () => {
                it("returns 'SS.T'", () => {
                    expect(ClockAnimator.formatTime(25.5)).toBe("25.5");
                });
            });
            describe("when the time is exactly 59.9", () => {
                it("returns '1:00'", () => {
                    expect(ClockAnimator.formatTime(59.9)).toBe("1:00");
                });
            });
        });
        describe("when the time is exactly 60", () => {
            it("returns '1:00'", () => {
                expect(ClockAnimator.formatTime(60)).toBe("1:00");
            });
        });
        describe("when the time is greater than 60", () => {
            it("returns 'M:SS'", () => {
                expect(ClockAnimator.formatTime(75)).toBe("1:15");
            });
        });
    });
});
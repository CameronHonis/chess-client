import {Square} from "../../src/models/game/square";

describe("Square", () => {
    describe("::EqualTo", () => {
        describe("when the instances being compared have identical data on all fields", () => {
            it("returns true", () => {
                const squareA = new Square(1, 2);
                const squareB = new Square(1, 2);
                expect(squareA.equalTo(squareB)).toBeTruthy();
            });
        });
    });
});
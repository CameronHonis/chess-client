// NOTE: useful for parsing validation and testing
export class Templated {
    constructor(args: Templated) {
    }

    static template(): Object {
        throw new Error("Unmarshallable.template() not implemented");
    }
}

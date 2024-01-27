import {Templated} from "../../src/abcs/templated";
import {Parser} from "../../src/helpers/parser";

class Company extends Templated {
    name: string;
    employees: Employee[];
    contact: ContactInfo;

    constructor(args: Company) {
        super({});
        this.name = args.name;
        this.employees = args.employees.map(e => new Employee(e));
        this.contact = new ContactInfo(args.contact);
    }

    static template(): Company {
        return new Company({
            name: "",
            employees: [
                Employee.template(),
            ],
            contact: ContactInfo.template(),
        });
    }
}

class Employee extends Templated {
    id: string;
    name: string;
    age: number;
    isRemote: boolean;

    constructor(args: Employee) {
        super({});
        this.id = args.id;
        this.name = args.name;
        this.age = args.age;
        this.isRemote = args.isRemote;
    }

    static template(): Employee {
        return new Employee({
            id: "",
            name: "",
            age: 0,
            isRemote: false,
        });
    }
}

class ContactInfo extends Templated {
    email: string;
    phone: string;

    constructor(args: ContactInfo) {
        super({});
        this.email = args.email;
        this.phone = args.phone;
    }

    static template(): ContactInfo {
        return new ContactInfo({
            email: "",
            phone: "",
        });
    }
}

function defaultCompanyJson(): object {
    return {
        name: "Test Company",
        employees: [
            {
                id: "1",
                name: "John Doe",
                age: 42,
                isRemote: true
            },
            {
                id: "2",
                name: "Jane Doe",
                age: 41,
                isRemote: false
            }
        ],
        contact: {
            email: "some-email@yahoo.com",
            phone: "123-456-7890"
        }
    };
}

describe("Parser", () => {
    describe("parseJson", () => {
        it("returns an instance of the given class", () => {
            const out = Parser.parseJson(defaultCompanyJson(), Company);
            expect(out).toBeInstanceOf(Company);
            expect(out.name).toBe("Test Company");
        });
        it("deeply unmarshals the JSON", () => {
            const out = Parser.parseJson(defaultCompanyJson(), Company);
            expect(out.employees[0]).toBeInstanceOf(Employee);
            expect(out.employees[0].name).toBe("John Doe");
            expect(out.contact).toBeInstanceOf(ContactInfo);
        });
        describe("when the JSON is missing a property", () => {
            let companyJson: { name?: string, employees: Array<{ name?: string }> };
            beforeEach(() => {
                companyJson = defaultCompanyJson() as { name?: string, employees: Array<{ name?: string }> };
                delete companyJson.name;
            });
            it("throws a type error", () => {
                expect(() => {
                    Parser.parseJson(companyJson, Company);
                }).toThrow(TypeError);
            });
            describe("when the property is on a nested class", () => {
                beforeEach(() => {
                    companyJson = defaultCompanyJson() as { name?: string, employees: Array<{ name?: string }> };
                    delete companyJson.employees[0].name;
                });
                it("throws a type error", () => {
                    expect(() => {
                        Parser.parseJson(companyJson, Company);
                    }).toThrow(TypeError);
                });
            });
        });
        describe("when the JSON has a property of the wrong type", () => {
            let companyJson: { name: string | number, employees: Array<Employee | { id: string | number }> };
            beforeEach(() => {
                companyJson = defaultCompanyJson() as {
                    name: string | number,
                    employees: Array<Employee | { id: string | number }>
                };
                companyJson.name = 42;
            });
            it("throws a type error", () => {
                expect(() => {
                    Parser.parseJson(companyJson, Company);
                }).toThrow(TypeError);
            });
            describe("when the property is on a nested class", () => {
                beforeEach(() => {
                    companyJson = defaultCompanyJson() as {
                        name: string | number,
                        employees: Array<Employee | { id: string | number }>
                    };
                    companyJson.employees[0].id = 42;
                });
                it("throws a type error", () => {
                    expect(() => {
                        Parser.parseJson(companyJson, Company);
                    }).toThrow(TypeError);
                });
            })
        })
        describe("when the JSON has an unexpected property", () => {
            let companyJson: Object;
            beforeEach(() => {
                companyJson = {...defaultCompanyJson(), foo: "bar"};
            })
            describe("when strict mode is enabled", () => {
                it("throws a type error", () => {
                    expect(() => {
                        Parser.parseJson(companyJson, Company, true);
                    }).toThrow(TypeError);
                });
            })
            describe("when strict mode is disabled", () => {
                it("does not throw an error", () => {
                    expect(() => {
                        Parser.parseJson(companyJson, Company, false);
                    }).not.toThrow();
                });
            })
        })
    });
});
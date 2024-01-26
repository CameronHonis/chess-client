import {Throwable} from "../types";

export class Unmarshallable {
    constructor(args: Unmarshallable) {
    }

    static template(): Object {
        throw new Error("Unmarshallable.template() not implemented");
    }
}

export class Marshaller {
    static unmarshalJson<T extends typeof Unmarshallable>(json: Object, cls: T, isStrictMode = true): Throwable<InstanceType<T>> {
        this.validateJson(json, cls.template(), isStrictMode, [cls.name]);
        return new cls(json) as InstanceType<T>;
    }

    private static validateJson<S, T>(
        json: S,
        template: T,
        isStrictMode: boolean,
        objPath: string[],
    ): Throwable<void> {
        type STKey = keyof S & keyof T;
        if (Array.isArray(template)) {
            if (!Array.isArray(json)) {
                throw new TypeError(`provided value for ${objPath.join(".")} was expected to be an array`);
            }
            if (template.length === 0 && json.length > 0) {
                throw new RangeError(`template expected to provide non-empty arrays at ${objPath.join(".")}`);
            }
            for (let i = 0; i < json.length; i++) {
                this.validateJson(json[i], template[0], isStrictMode, [...objPath, String(i)]);
            }
        } else {
            if (typeof template !== typeof json) {
                throw new TypeError(`provided value for ${objPath.join(".")}} does not match expected type ${typeof template}, got ${typeof json}`);
            }
            if (typeof template === "object" && template != null && json != null) {
                const fieldNames = Object.getOwnPropertyNames(template) as Array<Extract<STKey, string>>;
                for (const fieldName of fieldNames) {
                    this.validateJson(json[fieldName], template[fieldName], isStrictMode, [...objPath, fieldName]);
                }
                if (isStrictMode) {
                    const jsonFieldNames = Object.getOwnPropertyNames(json) as Array<Extract<STKey, string>>;
                    for (const fieldName of jsonFieldNames) {
                        if (!(fieldName in template)) {
                            throw new TypeError(`Unexpected field ${fieldName} at ${objPath.join(".")}`);
                        }
                    }
                }
            }
        }
        // const fieldNames = Object.getOwnPropertyNames(template) as Array<Extract<STKey, string>>;
        // for (const fieldName of fieldNames) {
        //     if (!(fieldName in json)) {
        //         throw new TypeError(`Missing field ${String(fieldName)} in json`);
        //     }
        //     const jsonVal = json[fieldName];
        //     const instanceVal = template[fieldName];
        //     if (typeof jsonVal !== typeof instanceVal) {
        //         throw new TypeError(`provided type ${typeof jsonVal} for ${instanceClsName}.${fieldName} does not match expected type ${typeof instanceVal}`);
        //     } else if (Array.isArray(jsonVal) || Array.isArray(instanceVal)) {
        //         if (!Array.isArray(instanceVal)) {
        //         } else if (!Array.isArray(jsonVal)) {
        //             throw new TypeError(`provided property ${instanceClsName}.${fieldName} is not an array as expected`);
        //         }
        //         for (let i = 0; i < jsonVal.length; i++) {
        //             if (typeof jsonVal[i] !== typeof instanceVal[i]) {
        //                 throw new TypeError(`provided type ${typeof jsonVal[i]} for ${instanceClsName}.${fieldName} does not match expected type ${typeof instanceVal[i]}`);
        //             } else if (typeof jsonVal[i] === "object" && jsonVal[i] !== null) {
        //                 this.validateJson(jsonVal[i], instanceVal[i], isStrictMode);
        //             }
        //         }
        //     } else if (typeof jsonVal === "object" && jsonVal !== null) {
        //         if (typeof instanceVal !== "object" || instanceVal === null) {
        //             throw new TypeError(`provided property ${instanceClsName}.${fieldName} was not expected to be an object`);
        //         }
        //         this.validateJson(jsonVal, instanceVal, isStrictMode);
        //     }
        // }
        // if (isStrictMode) {
        //     for (const propName of Object.keys(json)) {
        //         if (!fieldNames.map(String).includes(propName)) {
        //             throw new TypeError(`Unexpected field ${instanceClsName}.${propName} in json`);
        //         }
        //     }
        // }
    }
}
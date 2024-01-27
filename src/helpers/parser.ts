import {Throwable} from "../types";
import {Templated} from "../interfaces/templated";


export class Parser {
    static parseJson<T extends typeof Templated>(json: Object, cls: T, isStrictMode = true): Throwable<InstanceType<T>> {
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
    }
}
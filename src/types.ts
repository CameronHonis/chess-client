export type Throwable<T> = T;

export type Constructor<T> = new (...args: any[]) => T;

export type ReactComp<RC> = React.ReactElement<RC>;

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>

export type FieldsOf<T extends Constructor<any>> = Omit<InstanceType<T>, {
    [K in keyof InstanceType<T>]: keyof InstanceType<T>[K] extends Function ? K : never;
}[keyof InstanceType<T>]>;

export enum MouseButton {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
}
export type Throwable<T> = T;

export type Constructor<T> = new (...args: any[]) => T;

export type ReactComp<RC> = React.ReactElement<RC>;

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>
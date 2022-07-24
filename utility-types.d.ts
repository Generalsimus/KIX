export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];

export type NotUndefined<T> = Diff<Diff<T, undefined>, null>;

export type ValueOf<T> = T[keyof T];
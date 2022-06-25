import ts from "typescript";

const factory = ts.factory;


// type ReturnValue<T> = T extends string ? ts.Identifier : T

export const identifier = <T extends any | string>(StringOrNode: T): T extends string ? ts.Identifier : T => {
    if (typeof StringOrNode === "string") {


        return factory.createIdentifier(StringOrNode) as any;
    }
    return StringOrNode as any
} 
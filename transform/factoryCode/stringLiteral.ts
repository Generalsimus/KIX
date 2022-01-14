import ts from "typescript";

const factory = ts.factory;


type ReturnValue<T> = T extends string ? ts.StringLiteral : T

export const stringLiteral = <T extends string | ts.Node>(StringOrNode: T): ReturnValue<T> => {
    if (typeof StringOrNode === "string") {
        return factory.createStringLiteral(StringOrNode) as unknown as ReturnValue<T>
    }
    return StringOrNode as unknown as ReturnValue<T>
} 
import ts from "typescript";

const factory = ts.factory;


type ReturnValue<T> = T extends string ? ts.StringLiteral : T

export const identifier = <T extends unknown | string>(StringOrNode: T): ReturnValue<T> => {
    if (typeof StringOrNode === "string") {
        // const str = factory.createIdentifier(StringOrNode);
        // str.getText()
        return factory.createIdentifier(StringOrNode) as unknown as ReturnValue<T>
    }
    return StringOrNode as unknown as ReturnValue<T>
} 
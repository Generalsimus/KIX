import ts from "typescript";
import { identifier } from "./identifier";
import { stringLiteral } from "./stringLiteral";
const factory = ts.factory;



export function propertyAccessExpression(
    properties: (string | ts.Expression)[],
    accessType: "createElementAccessExpression" | "createPropertyAccessExpression" = "createElementAccessExpression"
) {
    let initValueFunction = accessType === "createElementAccessExpression" ? stringLiteral : identifier

    return properties.reduce((property1, property2) => {
        return factory[accessType](
            identifier(property1),
            initValueFunction(property2) as any,
        );
    }) as (ts.ElementAccessExpression | ts.PropertyAccessExpression);
}
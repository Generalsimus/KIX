import ts from "typescript";
import { identifier } from "./Identifier";
import { stringLiteral } from "./StringLiteral";
const factory = ts.factory;

type ArgsType = ts.ElementAccessExpression
export function elementAccessExpression(properties: [string | ts.Expression]) {

    // return properties.map
    return properties.reduce((property1, property2) => {
        return factory.createElementAccessExpression(
            identifier(property1),
            stringLiteral(property2),
        );
    }) as ts.ElementAccessExpression;
}
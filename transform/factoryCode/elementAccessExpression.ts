import ts from "typescript";
import { identifier } from "./identifier";
import { stringLiteral } from "./stringLiteral";
const factory = ts.factory;


export function elementAccessExpression(properties: (string | ts.Expression)[]) {


    return properties.reduce((property1, property2) => {
        return factory.createElementAccessExpression(
            identifier(property1),
            stringLiteral(property2),
        );
    }) as ts.ElementAccessExpression;
}
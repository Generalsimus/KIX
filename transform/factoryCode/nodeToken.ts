import ts from "typescript";
import { identifier } from "./identifier";
import { stringLiteral } from "./stringLiteral";
const factory = ts.factory;

type ArgsType = ts.ElementAccessExpression
export function nodeToken(nodes: (string | ts.Expression)[], token = ts.SyntaxKind.EqualsToken) {

    // return properties.map
    return nodes.reduce((property1, property2) => {
        return factory.createBinaryExpression(
            identifier(property1),
            factory.createToken(token as any),
            stringLiteral(property2),
        );
    }) as ts.BinaryExpression
}
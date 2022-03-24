import ts from "typescript"
import { identifier } from "./identifier"
import { stringLiteral } from "./stringLiteral";

export type createObjectArgsType = (ts.ObjectLiteralElementLike | [string | ts.Expression, ts.Expression] | ts.Expression)[]
export const createObject = (objectPropertiesNodes: createObjectArgsType) => {
    const factory = ts.factory;
    const saferPropertyRegexp = /^[a-zA-Z_]+$/;

    return factory.createObjectLiteralExpression(
        objectPropertiesNodes.map((node) => {
            if (node instanceof Array) {
                let propertyNameNode = node[0];
                let propertyNode: ts.Identifier | ts.StringLiteral | ts.ComputedPropertyName

                if (typeof propertyNameNode === "string" || ts.isIdentifier(propertyNameNode)) {

                    propertyNameNode = typeof propertyNameNode === "string" ? propertyNameNode : ts.idText(propertyNameNode);

                    propertyNode = saferPropertyRegexp.test(propertyNameNode) ? identifier(propertyNameNode) : stringLiteral(propertyNameNode);

                } else {
                    propertyNode = factory.createComputedPropertyName(propertyNameNode);
                }

                return factory.createPropertyAssignment(
                    propertyNode,
                    node[1]
                )
            } else if (ts.isObjectLiteralElementLike(node)) {
                return node
            }
            return factory.createSpreadAssignment(factory.createParenthesizedExpression(identifier(node)))
        }),
        true
    )
}
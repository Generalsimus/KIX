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
                const propertyNameNode = node[0]

                if (typeof propertyNameNode === "string") {
                    if (saferPropertyRegexp.test(propertyNameNode)) {
                        return factory.createPropertyAssignment(
                            identifier(propertyNameNode),
                            node[1]
                        )
                    } else {
                        return factory.createPropertyAssignment(
                            stringLiteral(propertyNameNode),
                            node[1]
                        )
                    }
                } else {
                    return factory.createPropertyAssignment(
                        factory.createComputedPropertyName(propertyNameNode),
                        node[1]
                    )
                }
            } else if (ts.isObjectLiteralElementLike(node)) {
                return node
            }
            return factory.createSpreadAssignment(factory.createParenthesizedExpression(identifier(node)))
        }),
        true
    )
}
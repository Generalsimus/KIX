import ts from "typescript"
import { stringLiteral } from "../../factoryCode/stringLiteral"

export const getExpressionNames = (
    node: ts.PropertyAccessExpression | ts.ElementAccessExpression | ts.LeftHandSideExpression,
    expressionIdentifiers: ts.Expression[] = []
) => {
    if (ts.isPropertyAccessExpression(node)) {
        getExpressionNames(node.expression, expressionIdentifiers)
        expressionIdentifiers.push(stringLiteral(node.name.getText()))
    } else if (ts.isElementAccessExpression(node)) {
        getExpressionNames(node.expression, expressionIdentifiers)
        expressionIdentifiers.push(node.argumentExpression)

    } else {
        expressionIdentifiers.push(node)
    }


    return expressionIdentifiers
}
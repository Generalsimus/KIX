import ts from "typescript"
import { CustomContextType } from "../.."
import { callFunction } from "../../factoryCode/callFunction"
import { stringLiteral } from "../../factoryCode/stringLiteral"

export const getExpressionNames = (
    node: ts.PropertyAccessExpression | ts.ElementAccessExpression | ts.LeftHandSideExpression,
    expressionIdentifiers: ts.Expression[] = [],
    haveQuestionDotToken: boolean = false
): boolean => {

    if (ts.isPropertyAccessExpression(node)) {
        if (node.questionDotToken) {
            haveQuestionDotToken = true
        }
        haveQuestionDotToken = getExpressionNames(node.expression, expressionIdentifiers, haveQuestionDotToken) || haveQuestionDotToken
        if (ts.isIdentifier(node.name)) {
            // console.log("🚀 --> file: getExpressionNames.ts --> line 18 --> node.name", node.name);
            expressionIdentifiers.push(stringLiteral(ts.idText(node.name)))
        }
    } else if (ts.isElementAccessExpression(node)) {
        if (node.questionDotToken) {
            haveQuestionDotToken = true
        }
        haveQuestionDotToken = getExpressionNames(node.expression, expressionIdentifiers, haveQuestionDotToken) || haveQuestionDotToken
        expressionIdentifiers.push(node.argumentExpression)

    } else {
        expressionIdentifiers.push(node)
    }


    return haveQuestionDotToken
}
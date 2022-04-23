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
        expressionIdentifiers.push(stringLiteral(node.name.getText()))
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
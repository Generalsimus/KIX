import ts from "typescript"
import { CustomContextType } from "../.."
import { callFunction } from "../../factoryCode/callFunction"
import { getExpressionNames } from "./getExpressionNames"

export const PropertyAccessExpressionOrElementAccessExpression = (
    node: ts.PropertyAccessExpression | ts.ElementAccessExpression,
    visitor: ts.Visitor,
    context: CustomContextType
) => {
    // context.hoistVariableDeclaration(node)
    if (context.getJSXPropRegistrationIdentifier) {
        // export var webSocketUrl = ({} as any).sdfsd.dsdf?. && ()
        const expressionIdentifiers: ts.Expression[] = [];
        const haveQuestionDotToken = getExpressionNames(node, expressionIdentifiers);

        // context.JsxHaveQuestionDotToken = haveQuestionDotToken;
        if (haveQuestionDotToken && node.parent) {
            context.JsxHaveQuestionDotToken = node.parent

        }

        // // const nodes = haveQuestionDotToken
        return visitor(callFunction(context.getJSXPropRegistrationIdentifier(), expressionIdentifiers))
    }
    return ts.visitEachChild(node, visitor, context)
}
import ts from "typescript";
import { CustomContextType } from "..";
import { callChainFunction } from "../factoryCode/callChainFunction";

export const CallExpression = (
    node: ts.CallExpression,
    visitor: ts.Visitor,
    context: CustomContextType
) => {
    const oldValue = context.JsxHaveQuestionDotToken
    let newNode = ts.visitEachChild(node, visitor, context)
    if (context.JsxHaveQuestionDotToken === node) {
        newNode = callChainFunction(newNode.expression, [...newNode.arguments])
    }
    context.JsxHaveQuestionDotToken = oldValue;
    return newNode;
}
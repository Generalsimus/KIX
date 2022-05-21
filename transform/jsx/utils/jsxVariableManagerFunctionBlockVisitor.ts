import ts from "typescript";
import { CustomContextType } from "../..";
import { visitFunctionForJsxRegistration } from "./visitFunctionForJsxRegistration";

export const jsxVariableManagerFunctionBlockVisitor = (
    node: ts.Node,
    visitor: ts.Visitor,
    context: CustomContextType
) => {

    const variableIdentifiersNameStatementCache = context.variableIdentifiersNameStatement;;
    context.variableIdentifiersNameStatement = new Map(variableIdentifiersNameStatementCache.entries());

    const visitedNode = visitFunctionForJsxRegistration(node, visitor, context);

    context.variableIdentifiersNameStatement = variableIdentifiersNameStatementCache;

    return visitedNode
}
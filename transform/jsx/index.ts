// TransformersObjectType

import ts from "typescript";
import { CustomContextType } from "..";
import { Identifier } from "./Identifier";
import { jsxToObject } from "./jsxToObject";
import { PropertyAccessExpressionOrElementAccessExpression } from "./utils/PropertyAccessExpressionOrElementAccessExpression";
import { visitFunctionDeclarationForJsxRegistration } from "./utils/visitFunctionDeclarationForJsxRegistration";
import { VariableStatement } from "./VariableStatement";

export const jsxTransformers = {
    [ts.SyntaxKind.JsxElement]: (node: ts.JsxElement, visitor: ts.Visitor, context: CustomContextType) => {

        const {
            openingElement: {
                tagName,
                attributes
            },
            children
        } = node;

        return jsxToObject(visitor, context, tagName, attributes, children)
    },
    [ts.SyntaxKind.JsxSelfClosingElement]: (node: ts.JsxSelfClosingElement, visitor: ts.Visitor, context: CustomContextType) => {

        return jsxToObject(visitor, context, node.tagName, node.attributes, [] as any)
    },
    [ts.SyntaxKind.ArrowFunction]: visitFunctionDeclarationForJsxRegistration,
    [ts.SyntaxKind.FunctionDeclaration]: visitFunctionDeclarationForJsxRegistration,
    [ts.SyntaxKind.PropertyAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,
    [ts.SyntaxKind.ElementAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,
    // [ts.SyntaxKind.Identifier]: Identifier,
    // [ts.SyntaxKind.VariableStatement]: VariableStatement,

}

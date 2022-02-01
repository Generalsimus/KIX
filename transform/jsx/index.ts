// TransformersObjectType

import ts, { factory, Statement } from "typescript";
import { CustomContextType } from "..";
import { jsxToObject } from "./jsxToObject";
import { useJsxRegistration } from "./useJsxRegistrator";
import { PropertyAccessExpressionOrElementAccessExpression, safeVisitorForJSXRegisters } from "./utils"

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

    [ts.SyntaxKind.PropertyAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,
    [ts.SyntaxKind.ElementAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,

}

// TransformersObjectType

import ts, { GeneratedIdentifierFlags, visitEachChild } from "typescript";
import { CustomContextType } from "..";
import { Identifier } from "./Identifier";
import { jsxToObject } from "./jsxToObject";
import { CallExpression } from "./utils/CallExpression";
import { createJsxChildrenNode } from "./utils/createJsxChildrenNode";
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
    [ts.SyntaxKind.JsxFragment]: (node: ts.JsxFragment, visitor: ts.Visitor, context: CustomContextType) => {
        const childrenNode = createJsxChildrenNode(
            visitor,
            context,
            node.children
        )
        return childrenNode
    },
    [ts.SyntaxKind.ArrowFunction]: visitFunctionDeclarationForJsxRegistration,
    [ts.SyntaxKind.FunctionDeclaration]: visitFunctionDeclarationForJsxRegistration,
    [ts.SyntaxKind.PropertyAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,
    [ts.SyntaxKind.ElementAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,
    [ts.SyntaxKind.CallExpression]: CallExpression,
    [ts.SyntaxKind.Identifier]: Identifier,
    // [ts.SyntaxKind.VariableStatement]: VariableStatement,
    [ts.SyntaxKind.VariableStatement]: VariableStatement,
    // [ts.SyntaxKind.BindingElement]: (node: ts.BindingElement, visitor: ts.Visitor, context: CustomContextType) => {
    //     return node
    //     return context.factory.getGeneratedNameForNode(node.name, GeneratedIdentifierFlags.AllowNameSubstitution);
    // },
    // [ts.SyntaxKind.VariableDeclaration]: (node: ts.VariableDeclaration, visitor: ts.Visitor, context: CustomContextType) => {
    //     (node as any)["name"] = context.factory.getGeneratedNameForNode(node.name, GeneratedIdentifierFlags.AllowNameSubstitution);
    //     if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
    //         context.hoistVariableDeclaration(node.name);
    //         // return undefined;
    //       }
    //       return visitEachChild(node, visitor, context);
    // }
    
}

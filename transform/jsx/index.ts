// TransformersObjectType

import ts, { GeneratedIdentifierFlags, visitEachChild } from "typescript";
import { CustomContextType } from "..";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { BinaryExpression } from "./BinaryExpression";
import { Identifier } from "./Identifier";
import { jsxToObject } from "./jsxToObject";
import { CallExpression } from "./utils/CallExpression";
import { createJsxChildrenNode } from "./utils/createJsxChildrenNode";
import { PostfixPostfixUnaryExpression } from "./utils/PostfixPostfix-UnaryExpression";
import { PropertyAccessExpressionOrElementAccessExpression } from "./utils/PropertyAccessExpressionOrElementAccessExpression";
import { visitFunctionForJsxRegistration } from "./utils/visitFunctionForJsxRegistration";
import { VariableStatement } from "./VariableStatement";





const jsxVariableManagerFunctionBlockVisitor = (node: ts.ArrowFunction | ts.FunctionDeclaration | ts.FunctionExpression, visitor: ts.Visitor, context: CustomContextType) => {
    const variableDeclarationStatementCache = context.variableDeclarationStatement;;
    context.variableDeclarationStatement = new Map(variableDeclarationStatementCache.entries());

    const visitedNode = visitFunctionForJsxRegistration(node, visitor, context);

    context.variableDeclarationStatement = variableDeclarationStatementCache;

    return visitedNode
}

// const createBlockVisitor = (blockVisitor: ts.Visitor) => {
//     return (node: ts.ArrowFunction | ts.FunctionDeclaration | ts.FunctionExpression, visitor: ts.Visitor, context: CustomContextType) => {
//         const variableDeclarationStatementCache = context.variableDeclarationStatement;;
//         context.variableDeclarationStatement = new Map(variableDeclarationStatementCache.entries());
//         const visitedNode = visitFunctionForJsxRegistration(node, visitor, context);
//         context.variableDeclarationStatement = variableDeclarationStatementCache;
//         return visitedNode
//     }
// }


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
    /*
    
    
    */
    [ts.SyntaxKind.ArrowFunction]: jsxVariableManagerFunctionBlockVisitor,
    // [ts.SyntaxKind.ArrowFunction]: visitFunctionForJsxRegistration,
    [ts.SyntaxKind.FunctionDeclaration]: jsxVariableManagerFunctionBlockVisitor,
    // [ts.SyntaxKind.FunctionDeclaration]: visitFunctionForJsxRegistration,
    [ts.SyntaxKind.FunctionExpression]: jsxVariableManagerFunctionBlockVisitor,
    // [ts.SyntaxKind.FunctionExpression]: visitFunctionForJsxRegistration,
    [ts.SyntaxKind.PropertyAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,
    [ts.SyntaxKind.ElementAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,
    [ts.SyntaxKind.CallExpression]: CallExpression,
    [ts.SyntaxKind.Identifier]: Identifier,
    [ts.SyntaxKind.BinaryExpression]: BinaryExpression,
    [ts.SyntaxKind.VariableStatement]: VariableStatement,
    [ts.SyntaxKind.Block]: (node: ts.Block, visitor: ts.Visitor, context: CustomContextType) => {
        // console.log("CCCCC")
        // node.statements.map((n) => ts.visitEachChild(n, visitor, context));
        // return context.factory.updateBlock(node, node.statements.map((n) => visitor(n) as any))
        // const visitedNode = ts.visitEachChild(node, visitor, context);
        // context.substituteNodesList.set(node, () => {
        //     console.log("🚀 --> file: index.ts --> line 89 --> context.substituteNodesList.set --> visitedNode", visitedNode);
        //     return visitedNode
        // })
        return ts.visitEachChild(node, visitor, context);
    },
    [ts.SyntaxKind.PostfixUnaryExpression]: PostfixPostfixUnaryExpression,
    [ts.SyntaxKind.PrefixUnaryExpression]: PostfixPostfixUnaryExpression,




}

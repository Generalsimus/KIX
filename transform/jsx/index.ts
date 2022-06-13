// TransformersObjectType

import ts from "typescript";
import { CustomContextType } from "..";
import { BinaryExpression } from "./BinaryExpression";
import { Identifier } from "./Identifier";
// import { IfStatement } from "./IfStatement";
import { jsxToObject } from "./jsxToObject";
import { CallExpression } from "./utils/CallExpression";
import { createJsxChildrenNode } from "./utils/createJsxChildrenNode";
import { PostfixPostfixUnaryExpression } from "./utils/PostfixPostfix-UnaryExpression";
import { PropertyAccessExpressionOrElementAccessExpression } from "./utils/PropertyAccessExpressionOrElementAccessExpression";
import { VariableStatement } from "./VariableStatement";



export const createLowLevelBlockVisitor = <N extends ts.Node>(nodeVisitor: (node: N, nodeVisitor: ts.Visitor, context: CustomContextType) => N) => {
    return (node: N, visitor: ts.Visitor, context: CustomContextType) => {
        const usedIdentifiersCache = context.usedIdentifiers || new Map();
        context.usedIdentifiers = new Map();
        let uniqueBlockStateIdentifiers: ReturnType<CustomContextType["getBlockVariableStateUniqueIdentifier"]>
        context.getBlockVariableStateUniqueIdentifier = () => {
            return uniqueBlockStateIdentifiers || (uniqueBlockStateIdentifiers = context.factory.createUniqueName("_"))
        };
        const visitedNode = nodeVisitor(node, visitor, context);


        context.usedIdentifiers.forEach((value, key) => {
            const cachedIdentifierState = usedIdentifiersCache.get(key);
            if (cachedIdentifierState && !value.isDeclared) {
                value.indexId = cachedIdentifierState.indexId
                cachedIdentifierState.isJsx = value.isJsx || cachedIdentifierState.isJsx
                cachedIdentifierState.isChanged = value.isChanged || cachedIdentifierState.isChanged

                value.substituteIdentifiers.forEach((value, key) => {
                    cachedIdentifierState.substituteIdentifiers.set(key, value);
                });
            } else {
                usedIdentifiersCache.set(key, value);
            }
        });


        context.usedIdentifiers = usedIdentifiersCache;
        return visitedNode;
    }
}


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

    [ts.SyntaxKind.IfStatement]: createLowLevelBlockVisitor(ts.visitEachChild),
    [ts.SyntaxKind.SwitchStatement]: createLowLevelBlockVisitor(ts.visitEachChild),
    [ts.SyntaxKind.IfStatement]: createLowLevelBlockVisitor(ts.visitEachChild),
    [ts.SyntaxKind.ForStatement]: createLowLevelBlockVisitor(ts.visitEachChild),
    [ts.SyntaxKind.ArrowFunction]: createLowLevelBlockVisitor(ts.visitEachChild),
    [ts.SyntaxKind.FunctionDeclaration]: createLowLevelBlockVisitor(ts.visitEachChild),
    [ts.SyntaxKind.FunctionExpression]: createLowLevelBlockVisitor(ts.visitEachChild),
    // [ts.SyntaxKind.ArrowFunction]: createSubstituteBlockVisitor(jsxVariableManagerFunctionBlockVisitor),
    // ts.IfStatement | ts.SwitchStatement
    // [ts.SyntaxKind.IfStatement]: createJsxBlockVariableRegistration<ts.IfStatement>(updateIfStatement),
    // [ts.SyntaxKind.SwitchStatement]: createJsxBlockVariableRegistration<ts.SwitchStatement>(updateSwitchStatement),
    // [ts.SyntaxKind.ArrowFunction]: visitFunctionForJsxRegistration,
    // [ts.SyntaxKind.FunctionDeclaration]: createSubstituteBlockVisitor(jsxVariableManagerFunctionBlockVisitor),
    // [ts.SyntaxKind.FunctionDeclaration]: visitFunctionForJsxRegistration,
    // [ts.SyntaxKind.FunctionExpression]: createSubstituteBlockVisitor(jsxVariableManagerFunctionBlockVisitor),
    // [ts.SyntaxKind.IfStatement]: createSubstituteBlockVisitor(childVisitor),
    // [ts.SyntaxKind.IfStatement]: substituteBlockNodeVisitor,
    // [ts.SyntaxKind.ForStatement]: substituteBlockNodeVisitor,
    // [ts.SyntaxKind.SwitchStatement]: substituteBlockNodeVisitor,
    // [ts.SyntaxKind.MethodDeclaration]: substituteBlockNodeVisitor,
    // [ts.SyntaxKind.ClassStaticBlockDeclaration]: substituteBlockNodeVisitor,
    // [ts.SyntaxKind.Parameter]: ParameterDeclaration,
    // [ts.SyntaxKind.FunctionExpression]: visitFunctionForJsxRegistration,
    [ts.SyntaxKind.PropertyAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,
    [ts.SyntaxKind.ElementAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,
    [ts.SyntaxKind.CallExpression]: CallExpression,
    [ts.SyntaxKind.Identifier]: Identifier,
    [ts.SyntaxKind.BinaryExpression]: BinaryExpression,
    [ts.SyntaxKind.VariableStatement]: VariableStatement,
    [ts.SyntaxKind.PostfixUnaryExpression]: PostfixPostfixUnaryExpression,
    [ts.SyntaxKind.PrefixUnaryExpression]: PostfixPostfixUnaryExpression,

}

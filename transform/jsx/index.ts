// TransformersObjectType

import ts, { } from "typescript";
import { CustomContextType } from "..";
import { BinaryExpression } from "./BinaryExpression";
import { Identifier } from "./Identifier";
// import { IfStatement } from "./IfStatement";
import { jsxToObject } from "./jsxToObject";
import { CallExpression } from "./utils/CallExpression";
import { createJsxChildrenNode } from "./utils/createJsxChildrenNode";
import { jsxVariableManagerFunctionBlockVisitor } from "./utils/jsxVariableManagerFunctionBlockVisitor";
import { PostfixPostfixUnaryExpression } from "./utils/PostfixPostfix-UnaryExpression";
import { PropertyAccessExpressionOrElementAccessExpression } from "./utils/PropertyAccessExpressionOrElementAccessExpression";
import { createSubstituteBlockVisitor, substituteBlockNodeVisitor } from "./utils/substituteBlockVisitors";
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
    /*
    
    
    */
    [ts.SyntaxKind.ArrowFunction]: createSubstituteBlockVisitor(jsxVariableManagerFunctionBlockVisitor),
    // [ts.SyntaxKind.ArrowFunction]: visitFunctionForJsxRegistration,
    [ts.SyntaxKind.FunctionDeclaration]: createSubstituteBlockVisitor(jsxVariableManagerFunctionBlockVisitor),
    // [ts.SyntaxKind.FunctionDeclaration]: visitFunctionForJsxRegistration,
    [ts.SyntaxKind.FunctionExpression]: createSubstituteBlockVisitor(jsxVariableManagerFunctionBlockVisitor),
    // [ts.SyntaxKind.IfStatement]: createSubstituteBlockVisitor(childVisitor),
    [ts.SyntaxKind.IfStatement]: substituteBlockNodeVisitor,
    [ts.SyntaxKind.SwitchStatement]: substituteBlockNodeVisitor,
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


import ts from "typescript";
import { CustomContextType, TransformersObjectType } from "..";
import { ArrowFunction } from "./ArrowFunction";
import { BinaryExpression } from "./BinaryExpression";
import { FunctionDeclaration } from "./FunctionDeclaration";
import { FunctionExpression } from "./FunctionExpression";
import { Identifier } from "./Identifier";
import { jsxToObject } from "./jsxToObject";
import { CallExpression } from "./CallExpression";
import { createJsxChildrenNode } from "./utils/createJsxChildrenNode";
import { PostfixPrefixUnaryExpression } from "./utils/PostfixPostfix-UnaryExpression";
import { PropertyAccessExpressionOrElementAccessExpression } from "./utils/PropertyAccessExpressionOrElementAccessExpression";
import { VariableStatement } from "./VariableStatement";
import { IfStatement } from './IfStatement';
import { SwitchStatement } from './SwitchStatement';
import { ForStatement } from './ForStatement';
import { ForInStatement } from './ForInStatement';
import { ForOfStatement } from './ForOfStatement';
import { MethodDeclaration } from './MethodDeclaration';
import { ClassStaticBlockDeclaration } from './ClassStaticBlockDeclaration';
import { TryStatement } from './TryStatement';
import { WhileStatement } from "./WhileStatement";


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
        return childrenNode || context.factory.createArrayLiteralExpression([], false)
    },
    [ts.SyntaxKind.ArrowFunction]: ArrowFunction,
    [ts.SyntaxKind.FunctionExpression]: FunctionExpression,
    [ts.SyntaxKind.FunctionDeclaration]: FunctionDeclaration,
    [ts.SyntaxKind.MethodDeclaration]: MethodDeclaration,
    [ts.SyntaxKind.ClassStaticBlockDeclaration]: ClassStaticBlockDeclaration,
    [ts.SyntaxKind.IfStatement]: IfStatement,
    [ts.SyntaxKind.TryStatement]: TryStatement,
    [ts.SyntaxKind.SwitchStatement]: SwitchStatement,
    [ts.SyntaxKind.WhileStatement]: WhileStatement,
    [ts.SyntaxKind.ForStatement]: ForStatement,
    [ts.SyntaxKind.ForInStatement]: ForInStatement,
    [ts.SyntaxKind.ForOfStatement]: ForOfStatement,



    ////////////////////////////////// 
    // [ts.SyntaxKind.CaseClause]: createLowLevelBlockVisitor(ts.visitEachChild),
    //  
    [ts.SyntaxKind.PropertyAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,
    [ts.SyntaxKind.ElementAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,
    [ts.SyntaxKind.CallExpression]: CallExpression,
    [ts.SyntaxKind.Identifier]: Identifier,
    [ts.SyntaxKind.BinaryExpression]: BinaryExpression,
    [ts.SyntaxKind.VariableStatement]: VariableStatement,
    [ts.SyntaxKind.PostfixUnaryExpression]: PostfixPrefixUnaryExpression,
    [ts.SyntaxKind.PrefixUnaryExpression]: PostfixPrefixUnaryExpression,

}

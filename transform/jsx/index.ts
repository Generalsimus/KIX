import { IfStatement } from './IfStatement';
// TransformersObjectType

import ts from "typescript";
import { CustomContextType } from "..";
import { ArrowFunction } from "./ArrowFunction";
import { BinaryExpression } from "./BinaryExpression";
// import { Block } from "./Block";
import { FunctionDeclaration } from "./FunctionDeclaration";
import { FunctionExpression } from "./FunctionExpression";
import { Identifier } from "./Identifier";
// import { IfStatement } from "./IfStatement";
import { jsxToObject } from "./jsxToObject";
import { CallExpression } from "./CallExpression";
import { createJsxChildrenNode } from "./utils/createJsxChildrenNode";
import { PostfixPostfixUnaryExpression } from "./utils/PostfixPostfix-UnaryExpression";
import { PropertyAccessExpressionOrElementAccessExpression } from "./utils/PropertyAccessExpressionOrElementAccessExpression";
import { VariableStatement } from "./VariableStatement";
import { SwitchStatement } from './SwitchStatement';
import { ForStatement } from './ForStatement';
import { ForInStatement } from './ForInStatement';
import { ForOfStatement } from './ForOfStatement';
import { MethodDeclaration } from './MethodDeclaration';
import { ClassStaticBlockDeclaration } from './ClassStaticBlockDeclaration';
import { TryStatement } from './TryStatement';



// export const createLowLevelBlockVisitor = <N extends ts.Node>(nodeVisitor: (node: N, nodeVisitor: ts.Visitor, context: CustomContextType) => N) => {
//     return (node: N, visitor: ts.Visitor, context: CustomContextType) => {
//         const usedIdentifiersCache = context.usedIdentifiers || new Map();
//         context.usedIdentifiers = new Map();
//         let uniqueBlockStateIdentifiers: ReturnType<CustomContextType["getBlockVariableStateUniqueIdentifier"]>
//         context.getBlockVariableStateUniqueIdentifier = () => {
//             return uniqueBlockStateIdentifiers ||= context.factory.createUniqueName("_")
//         };
//         const visitedNode = nodeVisitor(node, visitor, context);


//         // console.log("🚀 --> file: index.ts --> line 42 --> context.usedIdentifiers.forEach --> context.usedIdentifiers", context.usedIdentifiers.size);
//         context.usedIdentifiers.forEach((value, key) => {
//             const cachedIdentifierState = usedIdentifiersCache.get(key);
//             if (cachedIdentifierState && value.declaredFlag === undefined && (value.isChanged || value.isJsx)) {
//                 cachedIdentifierState.isJsx ||= value.isJsx;
//                 cachedIdentifierState.isChanged ||= value.isChanged;
//                 const { substituteCallback } = cachedIdentifierState
//                 cachedIdentifierState.substituteCallback = (...a) => {
//                     substituteCallback(...a);
//                     value.substituteCallback(...a);
//                 }
//             } else {
//                 usedIdentifiersCache.set(key, value);
//             }
//         });


//         context.usedIdentifiers = usedIdentifiersCache;
//         return visitedNode;
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
    [ts.SyntaxKind.ArrowFunction]: ArrowFunction,
    [ts.SyntaxKind.FunctionExpression]: FunctionExpression,
    [ts.SyntaxKind.FunctionDeclaration]: FunctionDeclaration,
    [ts.SyntaxKind.IfStatement]: IfStatement,
    [ts.SyntaxKind.SwitchStatement]: SwitchStatement,
    [ts.SyntaxKind.ForStatement]: ForStatement,
    [ts.SyntaxKind.ForInStatement]: ForInStatement,
    [ts.SyntaxKind.ForOfStatement]: ForOfStatement,
    [ts.SyntaxKind.MethodDeclaration]: MethodDeclaration,
    [ts.SyntaxKind.ClassStaticBlockDeclaration]: ClassStaticBlockDeclaration,
    [ts.SyntaxKind.TryStatement]: TryStatement,

    // [ts.SyntaxKind.IfStatement]: createLowLevelBlockVisitor(ts.visitEachChild),
    // [ts.SyntaxKind.CaseClause]: createLowLevelBlockVisitor(ts.visitEachChild),
    // 
    // [ts.SyntaxKind.SwitchStatement]: createLowLevelBlockVisitor(ts.visitEachChild),
    // [ts.SyntaxKind.IfStatement]: createLowLevelBlockVisitor(ts.visitEachChild),
    // [ts.SyntaxKind.ForStatement]: createLowLevelBlockVisitor(ts.visitEachChild),
    // [ts.SyntaxKind.ArrowFunction]: createLowLevelBlockVisitor(ts.visitEachChild),
    // [ts.SyntaxKind.FunctionDeclaration]: createLowLevelBlockVisitor(ts.visitEachChild),
    // [ts.SyntaxKind.FunctionExpression]: createLowLevelBlockVisitor(ts.visitEachChild),
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

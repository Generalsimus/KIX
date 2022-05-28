// TransformersObjectType

import ts, { visitEachChild } from "typescript";
import { CustomContextType, VariableDeclarationStatementItemType } from "..";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { BinaryExpression } from "./BinaryExpression";
import { Identifier } from "./Identifier";
// import { IfStatement } from "./IfStatement";
import { jsxToObject } from "./jsxToObject";
import { ParameterDeclaration } from "./ParameterDeclaration";
import { CallExpression } from "./utils/CallExpression";
import { createJsxChildrenNode } from "./utils/createJsxChildrenNode";
import { createVariableWithIdentifierKey } from "./utils/getVariableWithIdentifierKey";
import { jsxVariableManagerFunctionBlockVisitor } from "./utils/jsxVariableManagerFunctionBlockVisitor";
import { PostfixPostfixUnaryExpression } from "./utils/PostfixPostfix-UnaryExpression";
import { PropertyAccessExpressionOrElementAccessExpression } from "./utils/PropertyAccessExpressionOrElementAccessExpression";
import { createSubstituteBlockVisitor, substituteBlockNodeVisitor } from "./utils/substituteBlockVisitors";
import { VariableStatement } from "./VariableStatement";

type declarationTypes = {
    node: ts.VariableStatement
    declaration: ts.VariableDeclaration
} | {
    node: ts.VariableStatement
}
export type DeclarationIdentifiersStateType = {
    indexId: number,
    isJsx: boolean,
    isChanged: boolean,
    substituteIdentifiers: Map<ts.Identifier, () => ts.Node>,
    declaration?: declarationTypes
}
type replaceVariableDeclarationsData = Map<ts.VariableStatement, Map<ts.VariableDeclaration, DeclarationIdentifiersStateType>>
type replaceParameterDeclarationsData = Map<ts.VariableDeclaration, Set<DeclarationIdentifiersStateType>>

type replaceBlockNodesDataType = replaceVariableDeclarationsData & replaceParameterDeclarationsData

export type PreCustomContextType = CustomContextType & {
    // substituteIdentifiersStates: Map<string, VariableDeclarationStatementItemType>
    // declarations: Record<ts.NodeFlags.Const | ts.NodeFlags.Let | ts.NodeFlags.None, ts.VariableStatement | ts.ParameterDeclaration>
    // blockKind: ts.SyntaxKind.ArrowFunction | ts.SyntaxKind.FunctionDeclaration | ts.FunctionExpression
    usedIdentifiers: Map<string, DeclarationIdentifiersStateType>
    // declarationWaitingLobby: Map<string, VariableDeclarationStatementItemType>
    replaceBlockNodes: replaceBlockNodesDataType
    // blockDeclarationsState: {
    //     // declarations: Record<ts.NodeFlags.Const | ts.NodeFlags.Let | ts.NodeFlags.None, ts.VariableStatement | ts.ParameterDeclaration>
    //     replaceBlockNode: replaceVariableDeclarationsData | replaceParameterDeclarationsData
    // }
}
const JsxBlockVariableRegistration = (
    node: ts.Node,
    visitor: ts.Visitor,
    context: PreCustomContextType
) => {
    const { usedIdentifiers, replaceBlockNodes } = context
    const usedIdentifiersCache = context.usedIdentifiers
    const replaceBlockNodesCache = context.replaceBlockNodes
    context.usedIdentifiers = new Map();
    context.replaceBlockNodes = new Map();
    const visitedNode = visitor(node);
    context.usedIdentifiers = usedIdentifiersCache;
    context.replaceBlockNodes = replaceBlockNodesCache;

    return visitedNode;
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
    /*
    
    
    */
    [ts.SyntaxKind.ArrowFunction]: createSubstituteBlockVisitor(jsxVariableManagerFunctionBlockVisitor),
    [ts.SyntaxKind.IfStatement]: JsxBlockVariableRegistration,
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

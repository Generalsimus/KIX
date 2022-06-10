// TransformersObjectType

import ts, { visitEachChild } from "typescript";
import { CustomContextType, VariableDeclarationStatementItemType } from "..";
import { NotUndefined } from "../../utility-types";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { BinaryExpression } from "./BinaryExpression";
import { Identifier } from "./Identifier";
// import { IfStatement } from "./IfStatement";
import { jsxToObject } from "./jsxToObject";
import { ParameterDeclaration } from "./ParameterDeclaration";
import { CallExpression } from "./utils/CallExpression";
import { createJsxBlockVariableRegistration } from "./utils/createJsxBlockVariableRegistration";
import { updateIfStatement } from "./utils/createJsxBlockVariableRegistration/updateIfStatement";
import { updateSwitchStatement } from "./utils/createJsxBlockVariableRegistration/updateSwitchStatement";
import { createJsxChildrenNode } from "./utils/createJsxChildrenNode";
import { createVariableWithIdentifierKey } from "./utils/getVariableWithIdentifierKey";
import { jsxVariableManagerFunctionBlockVisitor } from "./utils/jsxVariableManagerFunctionBlockVisitor";
import { PostfixPostfixUnaryExpression } from "./utils/PostfixPostfix-UnaryExpression";
import { PropertyAccessExpressionOrElementAccessExpression } from "./utils/PropertyAccessExpressionOrElementAccessExpression";
import { createSubstituteBlockVisitor, substituteBlockNodeVisitor } from "./utils/substituteBlockVisitors";
import { VariableStatement } from "./VariableStatement";

export type VariableStatementDeclarationType = {
    node: ts.VariableStatement
    // declaration: ts.VariableDeclaration
}
export type ParameterDeclarationType = {
    node: ts.ParameterDeclaration
    // declaration: ts.VariableDeclaration
}
export type declarationTypes = VariableStatementDeclarationType | ParameterDeclarationType
export type DeclarationIdentifiersStateType = {
    name: string,
    indexId: number,
    isJsx: boolean,
    isChanged: boolean,
    // Map<ts.Identifier | ts.BinaryExpression | ts.PrefixUnaryExpression | ts.PostfixUnaryExpression, () => ts.Node> & 
    substituteIdentifiers: PreCustomContextType["substituteNodesList"],
    declaration?: declarationTypes & Pick<PreCustomContextType, "getBlockVariableStateUniqueIdentifier">
}
const getUniqueString = () => {

}
// export type BlockNodeTypes = ts.IfStatement | ts.SwitchStatement
// type replaceVariableDeclarationsData = Map<ts.VariableStatement, Map<ts.VariableDeclaration, DeclarationIdentifiersStateType>>
// type replaceParameterDeclarationsData = Map<ts.VariableDeclaration, Set<DeclarationIdentifiersStateType>>
export type replaceBlockNodesValueType = Record<string, Set<DeclarationIdentifiersStateType>>
// Record<string, [DeclarationIdentifiersStateType, NotUndefined<DeclarationIdentifiersStateType["declaration"]>]>
export type replaceBlockNodesType = Map<
    VariableStatementDeclarationType["node"] | ParameterDeclarationType["node"],
    replaceBlockNodesValueType
// Record<string, DeclarationIdentifiersStateType>
>

// & Map<
//     ParameterDeclarationType["node"],
//     Map<string, DeclarationIdentifiersStateType<ParameterDeclarationType>>
// >
// Map<
//     VariableStatementDeclarationType["node"],
//     Map<string, DeclarationIdentifiersStateType<VariableStatementDeclarationType>>
// > |
// Map<
//     ParameterDeclarationType["node"],
//     Map<string, DeclarationIdentifiersStateType<ParameterDeclarationType>>
// >

export type PreCustomContextType = CustomContextType & {
    // substituteIdentifiersStates: Map<string, VariableDeclarationStatementItemType>
    // declarations: Record<ts.NodeFlags.Const | ts.NodeFlags.Let | ts.NodeFlags.None, ts.VariableStatement | ts.ParameterDeclaration>
    // blockKind: ts.SyntaxKind.ArrowFunction | ts.SyntaxKind.FunctionDeclaration | ts.FunctionExpression

    // usedBlockIdentifiers: Map<string, DeclarationIdentifiersStateType>
    usedIdentifiersWithDeclaration: Map<string, DeclarationIdentifiersStateType>
    // declarationWaitingLobby: Map<string, VariableDeclarationStatementItemType>
    replaceBlockNodes: replaceBlockNodesType
    // & replaceBlockNodesType<ParameterDeclarationType>
    getBlockVariableStateUniqueIdentifier: () => ts.Identifier
    substituteNodesList: Map<ts.Node, () => ts.Node>
    // blockDeclarationsState: {
    //     // declarations: Record<ts.NodeFlags.Const | ts.NodeFlags.Let | ts.NodeFlags.None, ts.VariableStatement | ts.ParameterDeclaration>
    //     replaceBlockNode: replaceVariableDeclarationsData | replaceParameterDeclarationsData
    // }
} & {
    usedIdentifiers: Map<string, DeclarationIdentifiersStateType>
    getBlockVariableStateUniqueIdentifier: () => ts.Identifier
    substituteNodesList: Map<ts.Node, () => ts.Node>
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

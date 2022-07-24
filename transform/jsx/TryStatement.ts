import ts from "typescript";
import { CustomContextType } from "..";
import { NumberToUniqueString } from "../../utils/numberToUniqueString";
import { createObject } from "../factoryCode/createObject";
import { identifier } from "../factoryCode/identifier";
import { variableStatement } from "../factoryCode/variableStatement";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";
import { getIdentifierState } from "./utils/getIdentifierState";
const catchClauseVisitor = createBlockVisitor((
    node: ts.CatchClause,
    visitor: ts.Visitor,
    context: CustomContextType,
    variableState: VariableStateType
) => {
    let propertyDeclaration: Parameters<typeof createObject>[0] = [];
    const visitedNode = ts.visitEachChild(node, visitor, context);
    if (visitedNode.variableDeclaration) {
        const declarationNamesObject = getVariableDeclarationNames(visitedNode.variableDeclaration);
        for (const declarationIdentifierName in declarationNamesObject) {
            const identifierState = getIdentifierState(declarationIdentifierName, context);
            identifierState.declaredFlag = ts.NodeFlags.None;
            const { substituteCallback } = identifierState
            identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
                propertyDeclaration.push([
                    indexIdToUniqueString,
                    identifier(declarationIdentifierName)
                ])
                substituteCallback(indexIdToUniqueString, declarationIdentifier)
            }
        }
    }
    if (variableState.blockScopeIdentifiers) {
        return context.factory.updateCatchClause(
            visitedNode,
            visitedNode.variableDeclaration,
            context.factory.updateBlock(
                visitedNode.block,
                [
                    variableStatement([
                        [variableState.blockScopeIdentifiers, createObject(propertyDeclaration)]
                    ]),
                    ...visitedNode.block.statements
                ]
            ),
        )
    }
    return visitedNode
})
const tryBlockVisitor = createBlockVisitor((
    node: ts.Block,
    visitor: ts.Visitor,
    context: CustomContextType,
    variableState: VariableStateType
) => {

    const visitedNode = ts.visitEachChild(node, visitor, context);
    if (variableState.blockScopeIdentifiers) {
        return context.factory.updateBlock(
            visitedNode,
            [
                variableStatement([
                    [variableState.blockScopeIdentifiers, createObject([])]
                ]),
                ...visitedNode.statements
            ]
        )
    }
    return visitedNode;
})
export const TryStatement = (node: ts.TryStatement, visitor: ts.Visitor, context: CustomContextType) => {

    const tryBlock = tryBlockVisitor(node.tryBlock, visitor, context);
    const catchClause = node.catchClause && catchClauseVisitor(node.catchClause, visitor, context);
    const finallyBlock = node.finallyBlock && tryBlockVisitor(node.finallyBlock, visitor, context);
    return context.factory.updateTryStatement(
        node,
        tryBlock,
        catchClause,
        finallyBlock,
    )
}
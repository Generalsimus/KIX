import ts from "typescript";
import { CustomContextType } from "..";
import { NumberToUniqueString } from "../../utils/numberToUniqueString";
import { createObject, createObjectArgsType } from "../factoryCode/createObject";
import { identifier } from "../factoryCode/identifier";
import { variableStatement } from "../factoryCode/variableStatement";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";
// import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";

const TryStatementVisitor = createBlockVisitor(<N extends ts.Node>(node: N, visitor: ts.Visitor, context: CustomContextType) => {

    return visitor(node);
}, false);

const TryStatementCatchClauseVisitor = createBlockVisitor(<N extends ts.CatchClause>(node: N, visitor: ts.Visitor, context: CustomContextType) => {
    let propertyDeclaration: createObjectArgsType = [];
    if (node.variableDeclaration) {
        const declarationNamesObject = getVariableDeclarationNames(node.variableDeclaration);
        for (const declarationIdentifierName in declarationNamesObject) {
            context.addDeclaredIdentifierState(declarationIdentifierName);
            context.addIdentifiersChannelCallback(declarationIdentifierName, (identifierState) => {
                identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
                    propertyDeclaration.push([
                        indexIdToUniqueString,
                        identifier(declarationIdentifierName)
                    ])
                }
            })
        }
    }
    return {
        propertyDeclaration,
        visitedNode: visitor(node)
    }
}, false);

export const TryStatement = (
    node: ts.TryStatement,
    visitor: ts.Visitor,
    context: CustomContextType,
) => {
    //  tryBlock
    const [tryBlockNode, tryBlockVariableState] = TryStatementVisitor(node.tryBlock, visitor, context);

    //  catchClause
    const catchClause = node.catchClause && TryStatementCatchClauseVisitor(node.catchClause, visitor, context);
    let catchClauseNode: typeof node.catchClause
    if (catchClause) {
        const [{ propertyDeclaration, visitedNode }, catchClauseVariableState] = catchClause
        const visitedCatchClauseNode = visitedNode as ts.CatchClause

        catchClauseNode = visitedCatchClauseNode && context.factory.updateCatchClause(
            visitedCatchClauseNode,
            visitedCatchClauseNode.variableDeclaration,
            updateBlock(visitedCatchClauseNode.block, catchClauseVariableState, context, propertyDeclaration)
        );
    }
    // finallyBlock
    const finallyBlock = node.finallyBlock && TryStatementVisitor(node.finallyBlock, visitor, context);
    let finallyBlockNode: typeof node.finallyBlock
    if (finallyBlock) {
        const [visitedFinallyBlockNode, finallyBlockVariableState] = finallyBlock
        finallyBlockNode = visitedFinallyBlockNode && updateBlock(visitedFinallyBlockNode as ts.Block, finallyBlockVariableState, context)
    }
    // update
    return context.factory.updateTryStatement(
        node,
        updateBlock(tryBlockNode as typeof node.tryBlock, tryBlockVariableState, context),
        catchClauseNode,
        finallyBlockNode,
    )
}



const updateBlock = (
    node: ts.Block,
    variableState: VariableStateType,
    context: CustomContextType,
    definedVariablesNames: createObjectArgsType = [],
) => {
    if (variableState.blockScopeIdentifiers) {
        const declarationNode = variableStatement([
            [variableState.blockScopeIdentifiers, createObject(definedVariablesNames)]
        ]);
        return context.factory.updateBlock(
            node,
            [declarationNode, ...node.statements]
        )
    }
    return node
} 
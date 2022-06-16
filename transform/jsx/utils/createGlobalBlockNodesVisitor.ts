import ts, { visitEachChild } from "typescript"
import { CustomContextType } from "../.."
import { NumberToUniqueString } from "../../../utils/numberToUniqueString"
import { createObject, createObjectArgsType } from "../../factoryCode/createObject"
import { identifier } from "../../factoryCode/identifier"
import { variableStatement } from "../../factoryCode/variableStatement"
import { getVariableDeclarationNames } from "../../utils/getVariableDeclarationNames"
import { createBlockVisitor, VariableStateType } from "./createBlockVisitor"
import { getIdentifierState } from "./getIdentifierState"

export const createGlobalBlockNodesVisitor = <N extends ts.FunctionExpression | ts.ArrowFunction | ts.FunctionDeclaration>(
    updateNode: (Node: N, declaration: ts.VariableStatement, context: CustomContextType) => N
) => createBlockVisitor((
    node: N,
    visitor: ts.Visitor,
    context: CustomContextType,
    variableState: VariableStateType
) => {
    const declarationProperties: createObjectArgsType = [];

    for (const parameter of node.parameters) {
        const declarationNamesObject = getVariableDeclarationNames(parameter);
        for (const declarationIdentifierName in declarationNamesObject) {
            const identifierState = getIdentifierState(declarationIdentifierName, context);
            identifierState.declaredFlag = ts.NodeFlags.None
            const { substituteCallback } = identifierState
            identifierState.substituteCallback = (indexId: number, declarationIdentifier: ts.Identifier) => {
                declarationProperties.push([NumberToUniqueString(indexId), identifier(declarationIdentifierName)]);
                substituteCallback(indexId, declarationIdentifier);
            }

        }

    }
    const visitedNode = visitEachChild(node, visitor, context);

    if (variableState.globalScopeIdentifiers) {
        return updateNode(
            visitedNode,
            variableStatement([
                [variableState.globalScopeIdentifiers, createObject(declarationProperties)]
            ]),
            context
        )
    }

    return visitedNode
}, true); 
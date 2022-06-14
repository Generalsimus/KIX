import ts, { visitEachChild } from "typescript"
import { CustomContextType } from "../.."
import { NumberToUniqueString } from "../../../utils/numberToUniqueString"
import { createObject, createObjectArgsType } from "../../factoryCode/createObject"
import { identifier } from "../../factoryCode/identifier"
import { variableStatement } from "../../factoryCode/variableStatement"
import { getVariableDeclarationNames } from "../../utils/getVariableDeclarationNames"
import { getIdentifierState } from "./getIdentifierState"

export const createBlockNodeDeclarationUpdate = <N extends ts.FunctionExpression | ts.ArrowFunction | ts.FunctionDeclaration>(
    updateNode: (Node: N, declaration: ts.VariableStatement, context: CustomContextType) => N
) => {

    return (
        node: N,
        visitor: ts.Visitor,
        context: CustomContextType
    ): N => {
        const getGlobalVariableStateUniqueIdentifierCache = context.getGlobalVariableStateUniqueIdentifier
        let getGlobalVariableStateUniqueIdentifier: ReturnType<CustomContextType["getGlobalVariableStateUniqueIdentifier"]> | undefined
        context.getGlobalVariableStateUniqueIdentifier = () => {
            return getGlobalVariableStateUniqueIdentifier ||= context.factory.createUniqueName("_")
        }

        const visitedNode = visitEachChild(node, visitor, context);

        context.getGlobalVariableStateUniqueIdentifier = getGlobalVariableStateUniqueIdentifierCache


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


        if (getGlobalVariableStateUniqueIdentifier) {
            return updateNode(
                visitedNode,
                variableStatement([
                    [getGlobalVariableStateUniqueIdentifier, createObject(declarationProperties)]
                ]),
                context
            )
        }

        return visitedNode
    }
} 
import ts from "typescript";
import { CustomContextType } from "..";
import { NumberToUniqueString } from "../../utils/numberToUniqueString";
import { identifier } from "../factoryCode/identifier";
import { nodeToken } from "../factoryCode/nodeToken";
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { getIdentifierState } from "./utils/getIdentifierState";
// import { updateSubstitutions } from "./utils/updateSubstitutions";

export const VariableStatement = (node: ts.VariableStatement, visitor: ts.Visitor, context: CustomContextType) => {

    const visitedVariableStatement = ts.visitEachChild(node, visitor, context);

    const returnValue: ts.Node[] = [];
    for (const variableDeclaration of visitedVariableStatement.declarationList.declarations) {
        const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);

        returnValue.push(context.factory.updateVariableStatement(
            visitedVariableStatement,
            visitedVariableStatement.modifiers,
            context.factory.updateVariableDeclarationList(visitedVariableStatement.declarationList, [variableDeclaration])
        ));

        visitedVariableStatement.declarationList.flags
        // export enum NodeFlags {
        //     None = 0,
        //     Let = 1,
        //     Const = 2,
        for (const declarationIdentifierName in declarationNamesObject) {
            const identifierState = getIdentifierState(declarationIdentifierName, context);

            const declarationMarker = context.factory.createIdentifier("");
            returnValue.push(declarationMarker);
            identifierState.declaredFlag = visitedVariableStatement.declarationList.flags;
            const { substituteCallback } = identifierState
            identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
                context.substituteNodesList.set(declarationMarker, () => {
                    return context.factory.createExpressionStatement(nodeToken([
                        propertyAccessExpression(
                            [
                                declarationIdentifier,
                                indexIdToUniqueString
                            ],
                            "createPropertyAccessExpression"
                        ),
                        identifier(declarationIdentifierName)
                    ]));

                });
                substituteCallback(indexIdToUniqueString, declarationIdentifier);
            }


        }
    }


    return returnValue
}


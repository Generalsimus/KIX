import ts, { visitEachChild } from "typescript";
import { CustomContextType } from "..";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { createVariableWithIdentifierKey, getVariableWithIdentifierKey } from "./utils/getVariableWithIdentifierKey";
import { updateSubstitutions } from "./utils/updateSubstitutions";

export const VariableStatement = (node: ts.VariableStatement, visitor: ts.Visitor, context: CustomContextType) => {

    const visitedVariableDeclaration = visitEachChild(node, visitor, context);

    for (const variableDeclaration of node.declarationList.declarations) {
        const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);

        for (const declarationIdentifierName in declarationNamesObject) {
            const identifiersState = createVariableWithIdentifierKey(declarationIdentifierName, context);
            if (identifiersState.declarationNode) {
                identifiersState.isJsxIdentifier = false;
                identifiersState.valueChanged = false;
            }

            identifiersState.declarationNode = {
                declaration: variableDeclaration,
                declarationStatement: visitedVariableDeclaration

            }
            updateSubstitutions(declarationIdentifierName, identifiersState, context);
        }
    }

    return visitedVariableDeclaration
}



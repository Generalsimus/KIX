import ts, { visitEachChild } from "typescript";
import { CustomContextType, VariableDeclarationNodeType } from "..";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { createVariableWithIdentifierKey, getVariableWithIdentifierKey } from "./utils/getVariableWithIdentifierKey";
// import { updateSubstitutions } from "./utils/updateSubstitutions";

export const VariableStatement = (node: ts.VariableStatement, visitor: ts.Visitor, context: CustomContextType) => {

    const visitedVariableDeclaration = visitEachChild(node, visitor, context);


    for (const variableDeclaration of node.declarationList.declarations) {
        const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);

        for (const declarationIdentifierName in declarationNamesObject) {
            

            const identifiersState = createVariableWithIdentifierKey(declarationIdentifierName, context);


            identifiersState.variableDeclaration = {
                variableStatements: visitedVariableDeclaration,
                variableDeclaration: variableDeclaration

            };

            context.substituteBlockLobby.add(identifiersState);
        }
    }


    return visitedVariableDeclaration
}



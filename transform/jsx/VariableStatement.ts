import ts, { visitEachChild } from "typescript";
import { PreCustomContextType } from ".";
import { CustomContextType, VariableDeclarationNodeType } from "..";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { addInBlockTransformerIfNeeded, getIdentifierState } from "./utils/getIdentifierState";
import { createVariableWithIdentifierKey, getVariableWithIdentifierKey } from "./utils/getVariableWithIdentifierKey";
// import { updateSubstitutions } from "./utils/updateSubstitutions";

export const VariableStatement = (node: ts.VariableStatement, visitor: ts.Visitor, context: PreCustomContextType) => {

    const visitedVariableDeclaration = visitEachChild(node, visitor, context);


    for (const variableDeclaration of node.declarationList.declarations) {
        const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);

        for (const declarationIdentifierName in declarationNamesObject) {
            const identifierState = getIdentifierState(declarationIdentifierName, context);
            console.log("🚀 --> file: --> context.getBlockVariableStateUniqueIdentifier", context.getBlockVariableStateUniqueIdentifier);

            identifierState.declaration = {
                node: visitedVariableDeclaration,
                getBlockVariableStateUniqueIdentifier: context.getBlockVariableStateUniqueIdentifier,
                // declaration: variableDeclarations
            }
            // addInBlockTransformerIfNeeded(identifierState, context);

        }
    }


    return [visitedVariableDeclaration, context.factory.createIdentifier("სს")]
}



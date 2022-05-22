import ts, { visitEachChild } from "typescript";
import { CustomContextType, VariableDeclarationNodeType } from "..";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { createVariableWithIdentifierKey, getVariableWithIdentifierKey } from "./utils/getVariableWithIdentifierKey";
// import { updateSubstitutions } from "./utils/updateSubstitutions";

export const VariableStatement = (node: ts.VariableStatement, visitor: ts.Visitor, context: CustomContextType) => {

    const visitedVariableDeclaration = visitEachChild(node, visitor, context);

    // let BlockNodeCache: VariableDeclarationNodeType["blockNode"]
    // const declarationState: VariableDeclarationNodeType = 
    // export type VariableDeclarationStatementItemType<
    // D = VariableDeclarationNodeType
    // > = {
    //     identifiersIndex: number,
    //     isJsxIdentifier: boolean,
    //     valueChanged: boolean,
    //     variableDeclaration?: D
    //     blockNode?: ts.ArrowFunction | ts.FunctionDeclaration | ts.FunctionExpression
    // };

    // export type VariableDeclarationNodeType = {
    //     variableStatements: ts.VariableStatement,
    //     variableDeclaration: ts.VariableDeclaration,
    // }
    for (const variableDeclaration of node.declarationList.declarations) {
        const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);

        for (const declarationIdentifierName in declarationNamesObject) {
            const identifiersState = createVariableWithIdentifierKey(declarationIdentifierName, context);

            // const BlockNodeCache: VariableDeclarationNodeType["blockNode"] = undefined;
            identifiersState.variableDeclaration = {
                variableStatements: visitedVariableDeclaration,
                variableDeclaration: variableDeclaration

            };

            context.substituteBlockLobby.add(identifiersState);
            // declarationState.addAfterDeclarationsIdentifiers.set(declarationIdentifierName, variableDeclaration);

            // updateSubstitutions(declarationIdentifierName, identifiersState, context);
        }
    }


    return visitedVariableDeclaration
}



import ts from "typescript";
import { CustomContextType } from "..";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { createVariableWithIdentifierKey } from "./utils/getVariableWithIdentifierKey";

export const ParameterDeclaration = (node: ts.ParameterDeclaration, visitor: ts.Visitor, context: CustomContextType) => {
    // console.log("🚀 --> file: index.ts --> line 64 --> node", ts.idText(node.name));

    const declarationNamesObject = getVariableDeclarationNames(node);

    for (const declarationIdentifierName in declarationNamesObject) {
        const identifiersState = createVariableWithIdentifierKey(declarationIdentifierName, context);


        identifiersState.variableDeclaration = {
            variableStatements: node
        };

        context.substituteBlockLobby.add(identifiersState);
    }
    console.log("🚀 --> file: index.ts --> line 68 --> declarationNamesObject", declarationNamesObject);
    // createVariableWithIdentifierKey
    return node
}
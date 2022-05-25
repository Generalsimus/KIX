import ts from "typescript";
import { BlockNodeType, CustomContextType, ParameterDeclarationNodeType, VariableDeclarationNodeType, VariableDeclarationStatementItemType, variableDeclarationType } from "../../..";
import { getBlockNodeData } from "./utils/getBlockNodeData";
import { getParameterDeclarationData } from "./utils/getParameterDeclarationData";
import { getReplaceDeclarationsData } from "./utils/getReplaceDeclarationsData";
import { getVariableStatementData } from "./utils/getVariableStatementData";

export const updateIdentifierDeclaration = (
    identifiersState: VariableDeclarationStatementItemType,
    context: CustomContextType,
    declaration: variableDeclarationType,
    blockNode: BlockNodeType
) => {

    switch (declaration.variableStatements.kind) {
        case ts.SyntaxKind.VariableStatement:
            declaration = declaration as VariableDeclarationNodeType

            const variableStatementData = getVariableStatementData(context, declaration.variableStatements);
            const replaceDeclarationsData = getReplaceDeclarationsData(variableStatementData, declaration.variableDeclaration);
            replaceDeclarationsData.add(identifiersState);

            getBlockNodeData(context, blockNode).set(declaration.variableStatements, variableStatementData);
            break;
        case ts.SyntaxKind.Parameter:
            declaration = declaration as ParameterDeclarationNodeType
            const parameterDeclarationData = getParameterDeclarationData(context, declaration.variableStatements);
            // const replaceDeclarationsData = getReplaceDeclarationsData(variableStatementData, declaration.variableDeclaration);
            parameterDeclarationData.addAfterParameterDeclaration.add(identifiersState)
            // getParameterDeclarationData
            getBlockNodeData(context, blockNode).set(declaration.variableStatements, parameterDeclarationData);
            break;
    }

}
import ts from "typescript";
import { BlockNodeType, CustomContextType, ParameterDeclarationNodeType, VariableDeclarationNodeType, VariableDeclarationStatementItemType } from "../../..";
import { transformBlockNodes } from "./transformBlockNodes";
import { updateIdentifierDeclaration } from "./updateIdentifierDeclaration";
import { getBlockNodeData } from "./utils/getBlockNodeData";
import { getParameterDeclarationData } from "./utils/getParameterDeclarationData";
import { getReplaceDeclarationsData } from "./utils/getReplaceDeclarationsData";
import { getVariableStatementData } from "./utils/getVariableStatementData";

export const updateSubstituteData = (
    context: CustomContextType,
    identifiersState: VariableDeclarationStatementItemType
) => {
    let { blockNode, variableDeclaration, substituteIdentifiers, isJsxIdentifier, valueChanged } = identifiersState;


    if (isJsxIdentifier && valueChanged && variableDeclaration && blockNode) {
        // let declaration = variableDeclaration;
        const substituteBlockData = getBlockNodeData(context, blockNode);
        switch (variableDeclaration.variableStatements.kind) {
            case ts.SyntaxKind.VariableStatement:
                variableDeclaration = variableDeclaration as VariableDeclarationNodeType

                const variableStatementData = getVariableStatementData(context, variableDeclaration.variableStatements);
                const replaceDeclarationsData = getReplaceDeclarationsData(variableStatementData, variableDeclaration.variableDeclaration);
                replaceDeclarationsData.add(identifiersState);

                substituteBlockData.set(variableDeclaration.variableStatements, variableStatementData);
                break;
            case ts.SyntaxKind.Parameter:
                variableDeclaration = variableDeclaration as ParameterDeclarationNodeType
                const parameterDeclarationData = getParameterDeclarationData(context, variableDeclaration.variableStatements);

                parameterDeclarationData.addAfterParameterDeclaration.add(identifiersState)

                substituteBlockData.set(variableDeclaration.variableStatements, parameterDeclarationData);
                break;
        }

        context.enableSubstitution(blockNode.kind);
        substituteIdentifiers.set(blockNode, () => {


            return (transformBlockNodes as any)[blockNode.kind]?.(blockNode, context, substituteBlockData) || blockNode
        })

    }

}


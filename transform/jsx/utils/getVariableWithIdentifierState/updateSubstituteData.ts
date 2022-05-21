import ts from "typescript";
import { BlockNodeType, CustomContextType, VariableDeclarationStatementItemType } from "../../..";
import { transformBlockNodes } from "./transformBlockNodes";
import { getBlockNodeData } from "./utils/getBlockNodeData";
import { getReplaceDeclarationsData } from "./utils/getReplaceDeclarationsData";
import { getVariableStatementData } from "./utils/getVariableStatementData";

export const updateSubstituteData = (
    context: CustomContextType,
    identifiersState: VariableDeclarationStatementItemType
) => {
    const { blockNode, variableDeclaration, substituteIdentifiers, isJsxIdentifier, valueChanged } = identifiersState;


    if (isJsxIdentifier && valueChanged && variableDeclaration && blockNode) {

        const variableStatementData = getVariableStatementData(context, variableDeclaration.variableStatements);
        let replaceDeclarationsData = getReplaceDeclarationsData(variableStatementData, variableDeclaration.variableDeclaration)

        replaceDeclarationsData.add(identifiersState);
        const substituteBlockData = getBlockNodeData(context, blockNode);
        console.log("🚀 --> file: updateSubstituteData.ts --> line 22 --> substituteBlockData", substituteBlockData);
        substituteBlockData.variableStatementsData.set(variableDeclaration.variableStatements, variableStatementData);
        context.enableSubstitution(blockNode.kind);

        substituteIdentifiers.set(blockNode, () => {

            console.log("EEEEEEEEEEEEEEE", ts.SyntaxKind[blockNode.kind]);

            return (transformBlockNodes as any)[blockNode.kind]?.(blockNode, context, substituteBlockData) || blockNode
        })

    }

}


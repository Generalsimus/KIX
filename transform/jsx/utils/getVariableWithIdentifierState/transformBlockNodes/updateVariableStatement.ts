import ts from "typescript";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";

export const updateVariableStatement = (node: ts.VariableStatement, context: CustomContextType, substituteBlockData: ReturnType<typeof getBlockNodeData>) => {
    const variableStatementsData = substituteBlockData.variableStatementsData.get(node);
    if (variableStatementsData) {
        const updatedStatements: ts.Node[] = []

        for (const declaration of node.declarationList.declarations) {
            updatedStatements.push(context.factory.createVariableStatement(node.modifiers, [declaration]));

            const declarationData = variableStatementsData.replaceDeclarations.get(declaration);

            if (declarationData) {
                declarationData.forEach(element => {
                    updatedStatements.push(context.factory.createExpressionStatement(element.getEqualNode(element.identifierName)));
                })

            }



        }
        return updatedStatements
    }


    return [node]
}
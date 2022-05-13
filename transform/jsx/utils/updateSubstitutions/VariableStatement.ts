import ts from "typescript";
import { CustomContextType, VariableDeclarationNodeType, VariableDeclarationStatementItemType } from "../../..";
import { identifier } from "../../../factoryCode/identifier";
import { nodeToken } from "../../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../../factoryCode/propertyAccessExpression";
import { getKeyAccessIdentifierName } from "../../Identifier";

export const updateVariableStatement = (
    { declarationNode: { declarationStatement, declaration }, identifiersIndex }: Required<VariableDeclarationStatementItemType<VariableDeclarationNodeType>>,
    declarationIdentifierName: string,
    context: CustomContextType
) => {
    const variableStatementNodes: (ts.VariableStatement | ts.ExpressionStatement)[] = [];

    for (const declarationNode of declarationStatement.declarationList.declarations) {
        variableStatementNodes.push(context.factory.createVariableStatement(
            declarationStatement.modifiers,
            [declaration]
        ))
        if (declaration === declarationNode) {
            variableStatementNodes.push(
                context.factory.createExpressionStatement(
                    nodeToken([
                        propertyAccessExpression(
                            [
                                context.getVariableDeclarationStateNameIdentifier(),
                                getKeyAccessIdentifierName(identifiersIndex, declarationIdentifierName)
                            ],
                            "createPropertyAccessExpression"
                        ),
                        identifier(declarationIdentifierName)
                    ])
                )

            )


        }

    }

    return variableStatementNodes;
}
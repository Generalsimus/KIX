import ts from "typescript";
import { CustomContextType, VariableDeclarationNodeType, VariableDeclarationStatementItemType } from "../../..";
import { identifier } from "../../../factoryCode/identifier";
import { nodeToken } from "../../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../../factoryCode/propertyAccessExpression";
import { getKeyAccessIdentifierName } from "../../Identifier";


export type BlockVariableStatementReplaceType = {
    addAfterDeclarationIdentifiers: Map<ts.VariableDeclaration, Set<string>>;
    replace: () => ts.Node[]
}
export const updateVariableStatement = (
    // { declarationNode: { declarationStatement, declaration }, identifiersIndex }: Required<VariableDeclarationStatementItemType<VariableDeclarationNodeType>>,
    // declarationIdentifierName: string,
    // context: CustomContextType
) => {
    // let blockReplaceState = context.substituteBlockNodes.get(declarationStatement);
    // if (!blockReplaceState) {
    //     blockReplaceState = {
    //         addAfterDeclarationIdentifiers: new Map(),
    //         replace() {

    //             const variableStatementNodes: (ts.VariableStatement | ts.ExpressionStatement)[] = [];

    //             for (const declarationNode of declarationStatement.declarationList.declarations) {

    //                 variableStatementNodes.push(context.factory.createVariableStatement(
    //                     declarationStatement.modifiers,
    //                     [declaration]
    //                 ))

    //                 const addAfterDeclarationIdentifiers = this.addAfterDeclarationIdentifiers.get(declarationNode)
    //                 if (addAfterDeclarationIdentifiers?.size) {
    //                     addAfterDeclarationIdentifiers.forEach((identifierName) => {
    //                         variableStatementNodes.push(
    //                             context.factory.createExpressionStatement(
    //                                 nodeToken([
    //                                     propertyAccessExpression(
    //                                         [
    //                                             context.getVariableDeclarationStateNameIdentifier(),
    //                                             getKeyAccessIdentifierName(identifiersIndex, identifierName)
    //                                         ],
    //                                         "createPropertyAccessExpression"
    //                                     ),
    //                                     identifier(identifierName)
    //                                 ])
    //                             )

    //                         )
    //                     })
    //                 }

    //             }
    //             return variableStatementNodes
    //         }
    //     }
    //     context.substituteBlockNodes.set(declarationStatement, blockReplaceState)
    // }

    // new Set()

    // let addAfterDeclarationIdentifiers = blockReplaceState.addAfterDeclarationIdentifiers.get(declaration)
    // if (!addAfterDeclarationIdentifiers) {
    //     addAfterDeclarationIdentifiers = new Set()
    //     blockReplaceState.addAfterDeclarationIdentifiers.set(declaration, addAfterDeclarationIdentifiers)
    // };

    // addAfterDeclarationIdentifiers.add(declarationIdentifierName)


}
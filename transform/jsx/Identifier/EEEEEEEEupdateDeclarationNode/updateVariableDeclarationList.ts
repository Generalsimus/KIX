import ts from "typescript";
import { VariableDeclarationStatementItemType } from "../../..";
import { nodeToken } from "../../../factoryCode/nodeToken";
import { getVariableDeclarationNames } from "../../../utils/getVariableDeclarationNames";

export const updateVariableDeclarationList = (
    declarationNode: ts.VariableDeclarationList,
    substitutedIdentifierNames: Set<string>,
    variableDeclarationListNode: ts.VariableDeclarationList,
    context: ts.TransformationContext
) => {

    const declarations: ts.VariableDeclaration[] = [...variableDeclarationListNode.declarations];

    declarations.forEach((declaration, declarationIndex) => {
        const nextDeclaration = declarations[declarationIndex + 1];
        const initializer = declaration.initializer;
        const NodeEqualInitializer = [];
        const declarationNamesObject = getVariableDeclarationNames(declaration);
        for (const variableDeclarationName in declarationNamesObject) {
        console.log("🚀 --> file: updateVariableDeclarationList.ts --> line 21 --> declarations.forEach --> variableDeclarationName", variableDeclarationName);

        }
        // if (nextDeclaration) {
        //     declarations[declarationIndex + 1] = context.factory.updateVariableDeclaration(
        //         nextDeclaration,
        //         nextDeclaration.name,
        //         nextDeclaration.exclamationToken,
        //         nextDeclaration.type,
        //         declaration.initializer
        //     )
        // } else {
        //     declarations[declarationIndex + 1] = context.factory.createVariableDeclaration(
        //         context.factory.createUniqueName("J"),
        //         undefined,
        //         undefined,
        //         undefined,
        //     )

        // }



    });

    return context.factory.createArrayBindingPattern(
        [
            // context.factory.createIdentifier("kkkkk"),
            // context.factory.createIdentifier("234234"),
        ]
    )

    return context.factory.updateVariableDeclarationList(declarationNode, context.factory.createNodeArray(declarations));
}
import ts from "typescript";
import { CustomContextType, VariableDeclarationStatementItemType } from "../../..";
import { updateVariableDeclarationList } from "./updateVariableDeclarationList";

export const updateDeclarationNode = (identifierName: string, identifiersState: VariableDeclarationStatementItemType, context: CustomContextType) => {
    const { declarationNode } = identifiersState
    if (declarationNode) {
            const nodeSubstitutionFunction = context.substituteNodesList.get(declarationNode.declaration)
            // const substitutedIdentifierNames = nodeSubstitutionFunction?.substitutedIdentifierNames || new Set()
            // substitutedIdentifierNames.add(identifierName)

            // if (!nodeSubstitutionFunction) {
            //     const substituteDeclaration = function () {
            //         // console.log("🚀 --> file: index.ts --> line 15 --> substituteDeclaration --> declarationNode", declarationNode);
            //         if (ts.isVariableDeclarationList(declarationNode)) {
            //             return updateVariableDeclarationList(declarationNode, substitutedIdentifierNames, declarationNode, context)
            //         }
            //         return declarationNode
            //     }

            //     substituteDeclaration.substitutedIdentifierNames = substitutedIdentifierNames;

            //     context.substituteNodesList.set(declarationNode, substituteDeclaration);
            //     console.log("🚀 --> file: index.ts --> line 26 --> updateDeclarationNode --> substituteDeclaration", substituteDeclaration);
            // }

    }
}
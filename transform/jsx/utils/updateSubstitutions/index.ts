import ts from "typescript";
import { CustomContextType, VariableDeclarationStatementItemType } from "../../..";
import { updateVariableStatement } from "./VariableStatement";

export const updateSubstitutions = (
    identifierName: string,
    identifiersState: VariableDeclarationStatementItemType,
    context: CustomContextType
) => {
    // identifiersState.valueChanged
    const { isJsxIdentifier, valueChanged, declarationNode, substituteIdentifiers } = identifiersState
    if (isJsxIdentifier && valueChanged && declarationNode && substituteIdentifiers.size > 0) {
        const { declarationStatement } = declarationNode;

        context.substituteBlockNodes.set(declarationStatement, () => {
            switch (declarationStatement.kind) {
                case ts.SyntaxKind.VariableStatement:
                    return updateVariableStatement(identifiersState as any, identifierName, context)
            }
            return [declarationStatement];
        });

        substituteIdentifiers.forEach((value, key) => {
            context.enableSubstitution(key.kind)
            context.substituteNodesList.set(key, value);

        });
        substituteIdentifiers.clear();
    }
}
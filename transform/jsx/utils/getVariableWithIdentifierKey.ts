import { CustomContextType, VariableDeclarationNodeType, VariableDeclarationStatementItemType } from "../..";

let JSX_IDENTIFIERS_KEY_INDEX_CACHE = 0;

export const createVariableWithIdentifierKey = (identifierName: string, context: CustomContextType) => {

    const identifiersState: VariableDeclarationStatementItemType<VariableDeclarationNodeType> = {
        identifiersIndex: ++JSX_IDENTIFIERS_KEY_INDEX_CACHE,
        isJsxIdentifier: false,
        valueChanged: false,
        substituteIdentifiers: new Map(),
        declarationNode: undefined
    };

    context.variableDeclarationStatement.set(identifierName, identifiersState)

    return identifiersState
}
export const getVariableWithIdentifierKey = (identifierName: string, context: CustomContextType) => {
    let identifiersState = context.variableDeclarationStatement.get(identifierName)
    if (!identifiersState) {
        return createVariableWithIdentifierKey(identifierName, context)
    }
    return identifiersState
}
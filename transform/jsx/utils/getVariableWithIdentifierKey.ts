import { CustomContextType, VariableDeclarationNodeType, VariableDeclarationStatementItemType } from "../..";
import { getVariableWithIdentifierState } from "./getVariableWithIdentifierState";


export const createVariableWithIdentifierKey = (identifierName: string, context: CustomContextType) => {


    const identifiersState: VariableDeclarationStatementItemType = getVariableWithIdentifierState(context, identifierName)

    context.variableIdentifiersNameStatement.set(identifierName, identifiersState)

    return identifiersState
}
export const getVariableWithIdentifierKey = (identifierName: string, context: CustomContextType) => {
    let identifiersState = context.variableIdentifiersNameStatement.get(identifierName)
    if (!identifiersState) {
        return createVariableWithIdentifierKey(identifierName, context)
    }
    return identifiersState
}
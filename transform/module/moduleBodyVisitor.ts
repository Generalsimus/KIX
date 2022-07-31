import ts from "typescript"
import { CustomContextType } from ".."
import { createObject } from "../factoryCode/createObject"
import { variableStatement } from "../factoryCode/variableStatement"
import { createBlockVisitor, VariableStateType } from "../jsx/utils/createBlockVisitor"


export const moduleBodyVisitor = createBlockVisitor((
    statements: ts.Statement[],
    visitor: ts.Visitor,
    context: CustomContextType,
    variableState: VariableStateType
): ts.Statement[] => {
    const visitedStatements = statements.flatMap((node) => {
        const visitedNode = visitor(node);
        if (visitedNode instanceof Array) {
            return visitedNode as ts.Statement[]
        }
        return [visitedNode as ts.Statement]
    })
    if (variableState.globalScopeIdentifiers) {
        const declarationNode = variableStatement([
            [variableState.globalScopeIdentifiers, createObject([])]
        ])
        return [declarationNode, ...visitedStatements]
    }
    return visitedStatements
}, true)
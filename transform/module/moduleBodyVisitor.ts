import ts from "typescript"
import { CustomContextType } from ".."
import { createObject } from "../factoryCode/createObject"
import { variableStatement } from "../factoryCode/variableStatement"
import { newBlockVisitor, VariableStateType } from "../jsx/utils/createBlockVisitor"
import { creteManageIdentifierState } from "../jsx/utils/getIdentifierState"

const moduleBodyNodesVisitor = newBlockVisitor(<N extends ts.Statement[]>(statements: N, visitor: ts.Visitor, context: CustomContextType) => {
    return statements.flatMap((node) => {
        const visitedNode = visitor(node);
        if (visitedNode instanceof Array) {
            return visitedNode as ts.Statement[]
        }
        return [visitedNode as ts.Statement]
    })
}, true);

export const moduleBodyVisitor = (
    statements: ts.Statement[],
    visitor: ts.Visitor,
    context: CustomContextType,
    // variableState: VariableStateType
): ts.Statement[] => {

    const [visitedNode, variableState] = moduleBodyNodesVisitor(statements, visitor, context)


    if (variableState.globalScopeIdentifiers) {
        const declarationNode = variableStatement([
            [variableState.globalScopeIdentifiers, createObject([])]
        ])
        return [declarationNode, ...visitedNode]
    }
    return visitedNode
} 
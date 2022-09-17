import ts from "typescript";
import { CustomContextType } from "..";
import { createObject } from "../factoryCode/createObject";
import { variableStatement } from "../factoryCode/variableStatement";
import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";
const doWhileBlockVisitor = createBlockVisitor(<N extends ts.DoStatement["statement"]>(statement: N, visitor: ts.Visitor, context: CustomContextType) => {
    return visitor(statement) as typeof statement
}, false)

export const DoStatement = (node: ts.DoStatement, visitor: ts.Visitor, context: CustomContextType) => {
    const [visitedStatementNode, variableState] = doWhileBlockVisitor(node.statement, visitor, context);
    const expression = visitor(node.expression) as typeof node.expression


    return context.factory.updateDoStatement(
        node,
        updateStatement(visitedStatementNode, variableState, context),
        expression
    )
}









const updateStatement = (
    statement: ts.DoStatement["statement"],
    { blockScopeIdentifiers }: VariableStateType,
    context: CustomContextType
) => {
    if (!blockScopeIdentifiers) return statement



    const variableDeclarationNode = variableStatement([
        [
            blockScopeIdentifiers,
            createObject([])
        ],
    ], ts.NodeFlags.Const);



    if (ts.isBlock(statement)) {
        return context.factory.updateBlock(
            statement,
            [
                variableDeclarationNode,
                ...statement.statements
            ]
        )
    }

    return context.factory.createBlock([
        variableDeclarationNode,
        statement
    ]);

}
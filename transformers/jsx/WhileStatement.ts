import ts from "typescript";
import { CustomContextType } from "..";
import { createObject } from "../factoryCode/createObject";
import { variableStatement } from "../factoryCode/variableStatement";
import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";

TODO: `do while გაითვალისწინე ბიჯოოოო`
const WhileStatementBlockVisitor = createBlockVisitor(<N extends ts.IterationStatement["statement"]>(statement: N, visitor: ts.Visitor, context: CustomContextType) => {
    return visitor(statement);
}, false);

export const WhileStatement = (
    node: ts.WhileStatement,
    visitor: ts.Visitor,
    context: CustomContextType
) => {
    const [statement, variableState] = WhileStatementBlockVisitor(node.statement, visitor, context);


    return context.factory.updateWhileStatement(
        node,
        visitor(node.expression) as typeof node.expression,
        updateStatement(statement as typeof node.statement, variableState, context),
    )
}
const updateStatement = (statement: ts.IterationStatement["statement"], variableState: VariableStateType, context: CustomContextType) => {
    if (!variableState.blockScopeIdentifiers) return statement
    const declarationNode = variableStatement([
        [variableState.blockScopeIdentifiers, createObject([])]
    ]);
    if (ts.isBlock(statement)) {
        return context.factory.updateBlock(
            statement,
            [declarationNode, ...statement.statements],
        )
    }
    return context.factory.createBlock(
        [declarationNode, statement],
    )
}
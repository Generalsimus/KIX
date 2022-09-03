import ts from "typescript";
import { CustomContextType } from "..";
import { createObject } from "../factoryCode/createObject";
import { variableStatement } from "../factoryCode/variableStatement";
import { newBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";


const WhileStatementBlockVisitor = newBlockVisitor(<N extends ts.IterationStatement["statement"]>(node: N, visitor: ts.Visitor, context: CustomContextType) => {
    return visitor(node);
}, false);

export const WhileStatement = (
    node: ts.WhileStatement,
    visitor: ts.Visitor,
    context: CustomContextType
) => {
    const [statement, variableState] = WhileStatementBlockVisitor(node, visitor, context);


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
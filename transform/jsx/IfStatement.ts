import ts from "typescript";
import { CustomContextType } from "..";
import { createObject } from "../factoryCode/createObject";
import { variableStatement } from "../factoryCode/variableStatement";
import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";


const thenStatementVisitor = createBlockVisitor((
    node: ts.IfStatement["thenStatement"],
    visitor: ts.Visitor,
    context: CustomContextType,
    variableState: VariableStateType
) => {
    let visitedThenStatement = visitor(node) as ts.IfStatement["thenStatement"];
    if (variableState.blockScopeIdentifiers) {
        
        const declarationNode = variableStatement([
            [variableState.blockScopeIdentifiers, createObject([])]
        ]);
        if (ts.isBlock(visitedThenStatement)) {
            visitedThenStatement = context.factory.updateBlock(
                visitedThenStatement,
                [declarationNode, ...visitedThenStatement.statements]
            )
        } else {
            visitedThenStatement = context.factory.createBlock([declarationNode, visitedThenStatement], true)
        }

    }
    return visitedThenStatement
});


export const IfStatement = (
    node: ts.IfStatement,
    visitor: ts.Visitor,
    context: CustomContextType,
) => {
    const expression = visitor(node.expression) as ts.Expression;
    const thenStatement = thenStatementVisitor(node.thenStatement, visitor, context);
    const elseStatement = node.elseStatement && (visitor(node.elseStatement) as ts.Statement);


    return context.factory.updateIfStatement(
        node,
        expression,
        thenStatement,
        elseStatement,
    )
} 
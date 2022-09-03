import ts from "typescript";
import { CustomContextType } from "..";
import { createObject } from "../factoryCode/createObject";
import { variableStatement } from "../factoryCode/variableStatement";
import { newBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";

const visitIfStatementBlockNode = newBlockVisitor(<N extends ts.Node>(node: N, visitor: ts.Visitor, context: CustomContextType) => {

    return visitor(node);
}, false);


export const IfStatement = (node: ts.IfStatement, visitor: ts.Visitor, context: CustomContextType,) => {
    const expression = visitor(node.expression) as ts.Expression;
    const visitedThenStatement = visitIfStatementBlockNode(node.thenStatement, visitor, context);
    const visitedElseStatement = node.elseStatement && visitIfStatementBlockNode(node.elseStatement, visitor, context);



    return context.factory.updateIfStatement(
        node,
        expression,
        statementToBlock(visitedThenStatement[0] as ts.Statement, visitedThenStatement[1], context),
        visitedElseStatement && statementToBlock(visitedElseStatement[0] as ts.Statement, visitedElseStatement[1], context),
    )
}



const statementToBlock = (visitedNode: ts.Statement, variableState: VariableStateType, context: CustomContextType) => {
    if (!visitedNode || !variableState.blockScopeIdentifiers) return visitedNode

    const declarationNode = variableStatement([
        [variableState.blockScopeIdentifiers, createObject([])]
    ]);
    if (ts.isBlock(visitedNode)) {
        return context.factory.updateBlock(
            visitedNode,
            [declarationNode, ...visitedNode.statements]
        )
    } else {
        return context.factory.createBlock([
            declarationNode,
            visitedNode
        ], true)
    }
} 
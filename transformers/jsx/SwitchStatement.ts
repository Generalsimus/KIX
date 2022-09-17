import ts from "typescript";
import { CustomContextType } from "..";
import { createObject } from "../factoryCode/createObject";
import { variableStatement } from "../factoryCode/variableStatement";
import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";


const SwitchStatementBlockVisitor = createBlockVisitor(<N extends ts.NodeArray<ts.Statement>>(nodes: N, visitor: ts.Visitor, context: CustomContextType) => {


    return ts.visitNodes(nodes, visitor)
}, false);

export const SwitchStatement = (
    node: ts.SwitchStatement,
    visitor: ts.Visitor,
    context: CustomContextType
) => {
    // statement
    const clauses: ts.CaseOrDefaultClause[] = node.caseBlock.clauses.map(caseBlockNode => {
        const [visitedStatementNode, variableState] = SwitchStatementBlockVisitor(caseBlockNode.statements, visitor, context);
        const updatedStatements = updateCaseOrDefaultClauseStatements(visitedStatementNode, variableState) as ts.Statement[]
        if (ts.isDefaultClause(caseBlockNode)) {
            return context.factory.updateDefaultClause(
                caseBlockNode,
                updatedStatements
            )
        }
        return context.factory.updateCaseClause(
            caseBlockNode,
            visitor(caseBlockNode.expression) as ts.Expression,
            updatedStatements
        )
    });

    return context.factory.updateSwitchStatement(
        node,
        visitor(node.expression) as ts.Expression,
        context.factory.updateCaseBlock(
            node.caseBlock,
            clauses
        ),
    )
}


const updateCaseOrDefaultClauseStatements = (statements: ts.NodeArray<ts.Statement>, variableState: VariableStateType) => {
    if (variableState.blockScopeIdentifiers) {
        return [
            variableStatement([
                [variableState.blockScopeIdentifiers, createObject([])]
            ]),
            ...statements
        ]
    }

    return statements
}

import ts from "typescript";
import { CustomContextType } from "..";
import { createObject } from "../factoryCode/createObject";
import { variableStatement } from "../factoryCode/variableStatement";
import { newBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";


const SwitchStatementBlockVisitor = newBlockVisitor(<N extends ts.NodeArray<ts.Statement>>(node: N, visitor: ts.Visitor, context: CustomContextType) => {
    return node.map(el => visitor(el));
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


const updateCaseOrDefaultClauseStatements = (statements: ts.VisitResult<ts.Node>[], variableState: VariableStateType) => {
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
// import { createBlockVisitor } from "./utils/createBlockVisitor";
// console.log("🚀 --> file: createBlockVisitor.ts --> line 40 --> return --> visitor", ts.SyntaxKind[node.kind], visitor);
// const CaseBlockVisitor = createBlockVisitor<ts.SwitchStatement["caseBlock"]>((
//     node,
//     visitor,
//     context,
//     variableState) => {
//     // console.log("🚀 --> file: SwitchStatement.ts --> line 11 --> visitor", visitor);
//     return ts.visitEachChild(node, visitor, context)
// });
// TODO: სვიჩისთვის დეკლარაციიის სთეითი არ ემატება მაგრამ შეიძლება საჭიროება იყოს
// export const SwitchStatement = (node: ts.SwitchStatement, visitor: ts.Visitor, context: CustomContextType) => {
//     // console.log("🚀 --> file: SwitchStatement.ts --> line 14 --> SwitchStatement --> visitor", visitor);
//     // return node
//     const expression = visitor(node.expression) as ts.SwitchStatement["expression"];
//     const caseBlock = CaseBlockVisitor(node.caseBlock, visitor, context);


//     return context.factory.updateSwitchStatement(
//         node,
//         expression,
//         caseBlock
//     );
// }
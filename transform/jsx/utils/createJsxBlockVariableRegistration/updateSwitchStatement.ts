import ts from "typescript";
import { PreCustomContextType, replaceBlockNodesValueType } from "../..";
import { updateStatementsList } from "./updateStatementsList";

export const updateSwitchStatement = (node: ts.SwitchStatement, context: PreCustomContextType) => {
    // console.log("🚀 --> file: updateSwitchStatement.ts --> line 6 --> updateSwitchStatement --> replaceNodeData", replaceNodeData);
    // const replaceBlockNodes = context.replaceBlockNodes;
    // replaceNodeData: replaceBlockNodesValueType,
    const { caseBlock } = node;

    const newCaseBlock = context.factory.updateCaseBlock(caseBlock, caseBlock.clauses.map((item) => {
        const statements = updateStatementsList(item.statements, context);


        if (ts.isCaseClause(item)) {
            return context.factory.updateCaseClause(item, item.expression, statements);
        }

        return context.factory.updateDefaultClause(item, statements);
    }))


    return context.factory.updateSwitchStatement(node, node.expression, newCaseBlock);
}




// const newCaseBlock = context.factory.updateCaseBlock(caseBlock, caseBlock.clauses.map((item) => {
//     const statements = updateStatementsList(item.statements, context, substituteBlockData);

//     if (ts.isCaseClause(item)) {
//         return context.factory.updateCaseClause(item, item.expression, statements);
//     }

//     return context.factory.updateDefaultClause(item, statements);
// }))

// return context.factory.updateSwitchStatement(node, node.expression, newCaseBlock);
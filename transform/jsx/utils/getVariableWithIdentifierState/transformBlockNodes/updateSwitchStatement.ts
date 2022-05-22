import ts from "typescript";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";
import { updateStatementsList } from "./updateStatementsList";

export const updateSwitchStatement = (node: ts.SwitchStatement, context: CustomContextType, substituteBlockData: ReturnType<typeof getBlockNodeData>) => {

    const { caseBlock } = node

    const newCaseBlock = context.factory.updateCaseBlock(caseBlock, caseBlock.clauses.map((item) => {
        const statements = updateStatementsList(item.statements, context, substituteBlockData);

        if (ts.isCaseClause(item)) {
            return context.factory.updateCaseClause(item, item.expression, statements);
        }

        return context.factory.updateDefaultClause(item, statements);
    }))

    return context.factory.updateSwitchStatement(node, node.expression, newCaseBlock);
}
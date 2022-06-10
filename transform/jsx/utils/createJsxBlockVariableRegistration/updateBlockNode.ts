import ts from "typescript";
import { PreCustomContextType } from "../..";
import { updateStatementsList } from "./updateStatementsList";

export const updateBlockNode = (
    blockNode: ts.ConciseBody | ts.Statement,
    context: PreCustomContextType,
) => {
    const isBlock = ts.isBlock(blockNode);

    const statements = isBlock ? blockNode.statements : [blockNode];
    const updatedStatements = updateStatementsList(statements, context);

    return isBlock ?
        context.factory.updateBlock(blockNode, updateStatementsList(blockNode.statements, context))
        : context.factory.createBlock(updatedStatements, false)
}
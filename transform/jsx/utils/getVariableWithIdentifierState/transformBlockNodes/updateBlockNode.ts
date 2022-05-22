import ts from "typescript";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";
import { updateStatementsList } from "./updateStatementsList";

export const updateBlockNode = (
    blockNode: ts.ConciseBody | ts.Statement,
    substituteBlockData: ReturnType<typeof getBlockNodeData>,
    context: CustomContextType,
) => {
    const isBlock = ts.isBlock(blockNode);

    const statements = isBlock ? blockNode.statements : [blockNode];
    const updatedStatements = updateStatementsList(statements, context, substituteBlockData);

    return isBlock ?
        context.factory.updateBlock(blockNode, updateStatementsList(blockNode.statements, context, substituteBlockData))
        : context.factory.createBlock(updatedStatements, false)
}
import ts from "typescript";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";
import { updateBlockNode } from "./updateBlockNode";

export const updateTryStatement = (node: ts.TryStatement, context: CustomContextType, substituteBlockData: ReturnType<typeof getBlockNodeData>) => {

    const { catchClause } = node
    
    return context.factory.updateTryStatement(
        node,
        updateBlockNode(node.tryBlock, substituteBlockData, context),
        catchClause && context.factory.updateCatchClause(
            catchClause,
            catchClause.variableDeclaration,
            updateBlockNode(catchClause.block, substituteBlockData, context)
        ),
        (node.finallyBlock && updateBlockNode(node.finallyBlock, substituteBlockData, context)),
    )
}
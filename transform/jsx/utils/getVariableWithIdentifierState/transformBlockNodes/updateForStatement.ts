import ts from "typescript";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";
import { updateBlockNode } from "./updateBlockNode";

export const updateForStatement = (node: ts.ForStatement, context: CustomContextType, substituteBlockData: ReturnType<typeof getBlockNodeData>) => {

    return context.factory.updateForStatement(
        node,
        node.initializer,
        node.condition,
        node.incrementor,
        updateBlockNode(node.statement, substituteBlockData, context)
    )
}
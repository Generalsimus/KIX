import ts from "typescript";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";
import { updateBlockNode } from "./updateBlockNode";
import { updateStatementsList } from "./updateStatementsList";

export const updateIfStatement = (node: ts.IfStatement, context: CustomContextType, substituteBlockData: ReturnType<typeof getBlockNodeData>) => {

    return context.factory.updateIfStatement(
        node,
        node.expression,
        updateBlockNode(node.thenStatement, substituteBlockData, context),
        node.elseStatement && updateBlockNode(node.elseStatement, substituteBlockData, context),
    )
}
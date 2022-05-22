import ts from "typescript";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";
import { updateBlockNode } from "./updateBlockNode";

export const updateFunctionExpression = (node: ts.FunctionExpression, context: CustomContextType, substituteBlockData: ReturnType<typeof getBlockNodeData>) => {
    return context.factory.updateFunctionExpression(
        node,
        node.modifiers,
        node.asteriskToken,
        node.name,
        node.typeParameters,
        node.parameters,
        node.type,
        updateBlockNode(node.body, substituteBlockData, context)
    );
}
import ts from "typescript";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";
import { updateBlockNode } from "./updateBlockNode";

export const updateClassStaticBlockDeclaration = (node: ts.ClassStaticBlockDeclaration, context: CustomContextType, substituteBlockData: ReturnType<typeof getBlockNodeData>) => {

    return context.factory.updateClassStaticBlockDeclaration(
        node,
        node.decorators,
        node.modifiers,
        updateBlockNode(node.body, substituteBlockData, context)
    )
}
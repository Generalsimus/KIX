import ts from "typescript";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";
import { updateBlockNode } from "./updateBlockNode";

export const updateArrowFunction = (node: ts.ArrowFunction, context: CustomContextType, substituteBlockData: ReturnType<typeof getBlockNodeData>) => {


    return context.factory.updateArrowFunction(
        node,
        node.modifiers,
        node.typeParameters,
        node.parameters,
        node.type,
        node.equalsGreaterThanToken,
        updateBlockNode(node.body, substituteBlockData, context)
    );
}



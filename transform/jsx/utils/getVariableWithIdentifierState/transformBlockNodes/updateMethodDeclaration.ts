import ts from "typescript";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";
import { updateBlockNode } from "./updateBlockNode";

export const updateMethodDeclaration = (node: ts.MethodDeclaration, context: CustomContextType, substituteBlockData: ReturnType<typeof getBlockNodeData>) => {


    return context.factory.updateMethodDeclaration(
        node,
        node.decorators,
        node.modifiers,
        node.asteriskToken,
        node.name,
        node.questionToken,
        node.typeParameters,
        node.parameters,
        node.type,
        (node.body && updateBlockNode(node.body, substituteBlockData, context)),
    )
}
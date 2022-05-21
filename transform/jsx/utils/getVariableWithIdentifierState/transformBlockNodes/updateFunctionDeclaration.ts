import ts from "typescript";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";
import { updateBlockNode } from "./updateBlockNode";

export const updateFunctionDeclaration = (node: ts.FunctionDeclaration, context: CustomContextType, substituteBlockData: ReturnType<typeof getBlockNodeData>) => {
// console.log("🚀 --> file: updateFunctionDeclaration.ts --> line 7 --> updateFunctionDeclaration --> substituteBlockData", substituteBlockData);



    return context.factory.updateFunctionDeclaration(
        node,
        node.decorators,
        node.modifiers,
        node.asteriskToken,
        node.name,
        node.typeParameters,
        node.parameters,
        node.type,
        (node.body && updateBlockNode(node.body, substituteBlockData, context))
    );
}
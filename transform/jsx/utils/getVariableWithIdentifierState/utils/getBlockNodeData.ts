import ts from "typescript";
import { BlockNodeType, CustomContextType } from "../../../..";

export const getBlockNodeData = (context: CustomContextType, node: BlockNodeType) => {
    let substituteBlockData = context.substituteNodesData.get(node)
    let blockStateIdentifierName: ts.Identifier;
    if (!substituteBlockData) {
        context.substituteNodesData.set(node, (substituteBlockData = {
            data: new Map(),
            get blockStateIdentifierName() {
                return blockStateIdentifierName || (blockStateIdentifierName = context.factory.createUniqueName("_"))
            },
        }));
    }

    return substituteBlockData
}
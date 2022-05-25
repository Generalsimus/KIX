import { BlockNodeType, CustomContextType } from "../../../..";

export const getBlockNodeData = (context: CustomContextType, node: BlockNodeType) => {
    let substituteBlockData = context.substituteNodesData.get(node)
    if (!substituteBlockData) {
        context.substituteNodesData.set(node, (substituteBlockData = new Map()));
    }
    return substituteBlockData
}
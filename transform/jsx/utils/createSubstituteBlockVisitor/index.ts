import ts from "typescript";
import { CustomContextType } from "../../..";

export const createSubstituteBlockVisitor = (
    visitor: (node: ts.Node, visitor: ts.Visitor, context: CustomContextType) => ts.Node
) => {
    return (node: ts.Node, nodeVisitor: ts.Visitor, context: CustomContextType) => {
        const blockNodesLobbyCache = context.substituteBlockLobby;
        const blockNodesLobby = context.substituteBlockLobby = new Set();
        const visitedNode = visitor(node, nodeVisitor, context);
        if (blockNodesLobby.size > 0) {
            blockNodesLobby.forEach(blockNode => {
                blockNode.blockNode = visitedNode as any;
            });
        }
        context.substituteBlockLobby = blockNodesLobbyCache;

        return visitedNode;
    }
}
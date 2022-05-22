import ts from "typescript";
import { BlockNodeType, CustomContextType } from "../..";

export const createSubstituteBlockVisitor = (
    visitor: (node: ts.Node, visitor: ts.Visitor, context: CustomContextType) => ts.Node
) => {
    return (node: ts.Node, nodeVisitor: ts.Visitor, context: CustomContextType) => {
        const blockNodesLobbyCache = context.substituteBlockLobby;
        const blockNodesLobby = context.substituteBlockLobby = new Set();
        const visitedNode = visitor(node, nodeVisitor, context);
        if (blockNodesLobby.size > 0) {


            blockNodesLobby.forEach(lobbyItem => {
                lobbyItem.blockNode = visitedNode as any;
            });
        }
        context.substituteBlockLobby = blockNodesLobbyCache;

        return visitedNode;
    }
}


// export const asyncBlockNodeVisitor = (node: ts.Statement, visitor: ts.Visitor, context: CustomContextType): [ts.VisitResult<ts.Node>, (blockNode: BlockNodeType) => void] => {
//     const blockNodesLobbyCache = context.substituteBlockLobby;
//     const blockNodesLobby = context.substituteBlockLobby = new Set();
//     const visitedNode = visitor(node);
//     context.substituteBlockLobby = blockNodesLobbyCache;
//     return [
//         visitedNode,
//         (blockNode: BlockNodeType) => {
//             if (blockNodesLobby.size > 0) {
//                 blockNodesLobby.forEach(lobbyItem => {
//                     lobbyItem.blockNode = blockNode;
//                 });
//             }
//         }
//     ]
// }

export const substituteBlockNodeVisitor = createSubstituteBlockVisitor(
    (node: ts.Node, visitor: ts.Visitor, context: CustomContextType) => ts.visitEachChild(node, visitor, context)
);


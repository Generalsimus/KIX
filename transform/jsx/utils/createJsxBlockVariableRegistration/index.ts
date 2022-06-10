import ts from "typescript"
import { declarationTypes, PreCustomContextType } from "../.."

type CallUpdateCall<N> = (node: N, context: PreCustomContextType) => N
export const createJsxBlockVariableRegistration = <N extends ts.Node>(updateBlock: CallUpdateCall<N>) => {
    return (
        node: N,
        visitor: ts.Visitor,
        context: PreCustomContextType
    ) => {

        // CACHE CONTEXT
        // const { usedIdentifiers, replaceBlockNodes } = context
        // const usedIdentifiersCache = context.usedIdentifiers
        // const replaceBlockNodesCache = context.replaceBlockNodes
        const getBlockVariableStateUniqueIdentifierCache = context.getBlockVariableStateUniqueIdentifier

        // CREATE CONTEXT
        // context.usedIdentifiers = new Map(usedIdentifiers.entries());
        // context.replaceBlockNodes = new Map(replaceBlockNodes.entries());
        const replaceBlockSizeBeforeVisit = context.replaceBlockNodes.size
        let blockVariableStateUniqueIdentifier: ts.Identifier | undefined
        context.getBlockVariableStateUniqueIdentifier = () => {
            return blockVariableStateUniqueIdentifier || (blockVariableStateUniqueIdentifier = context.factory.createUniqueName("_"))
        }
        // VISIT CONTEXT
        let visitedNode = ts.visitEachChild(node, visitor, context);
        if (context.replaceBlockNodes.size > 0 && blockVariableStateUniqueIdentifier) {
            visitedNode = updateBlock(visitedNode as any, context);
        }
        // RESET CONTEXT 
        // context.usedIdentifiers = new Map(usedIdentifiers.entries());
        // context.replaceBlockNodes = new Map(replaceBlockNodes.entries());
        context.getBlockVariableStateUniqueIdentifier = getBlockVariableStateUniqueIdentifierCache;

        return visitedNode;
    }
}

import ts from "typescript";
import { CustomContextType } from "../..";

export const createBlockVisitor = <N extends ts.Node>(
    nodeVisitor: (node: N, nodeVisitor: ts.Visitor, context: CustomContextType) => N
) => {
    return (node: N, visitor: ts.Visitor, context: CustomContextType) => {
        const usedIdentifiersCache = context.usedIdentifiers || new Map();
        context.usedIdentifiers = new Map();
        // let uniqueBlockStateIdentifiers: ReturnType<CustomContextType["getBlockVariableStateUniqueIdentifier"]>
        // context.getBlockVariableStateUniqueIdentifier = () => {
        //     return uniqueBlockStateIdentifiers ||= context.factory.createUniqueName("_")
        // };
        const visitedNode = nodeVisitor(node, visitor, context);


        // console.log("🚀 --> file: index.ts --> line 42 --> context.usedIdentifiers.forEach --> context.usedIdentifiers", context.usedIdentifiers.size);
        context.usedIdentifiers.forEach((value, key) => {
            const cachedIdentifierState = usedIdentifiersCache.get(key);
            if (cachedIdentifierState && value.declaredFlag === undefined && (value.isChanged || value.isJsx)) {
                cachedIdentifierState.isJsx ||= value.isJsx;
                cachedIdentifierState.isChanged ||= value.isChanged;
                const { substituteCallback } = cachedIdentifierState
                cachedIdentifierState.substituteCallback = (...a) => {
                    substituteCallback(...a);
                    value.substituteCallback(...a);
                }
            } else {
                usedIdentifiersCache.set(key, value);
            }
        });


        context.usedIdentifiers = usedIdentifiersCache;
        return visitedNode;
    }
}
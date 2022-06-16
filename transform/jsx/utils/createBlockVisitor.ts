import ts from "typescript";
import { CustomContextType } from "../..";


export type VariableStateType = {
    blockScopeIdentifiers?: ReturnType<CustomContextType["getVariableUniqueIdentifier"]>
    globalScopeIdentifiers?: ReturnType<CustomContextType["getVariableUniqueIdentifier"]>

}
export const createBlockVisitor = <N extends ts.Node>(
    nodeVisitor: (
        node: N,
        nodeVisitor: ts.Visitor,
        context: CustomContextType,
        variableState: VariableStateType
    ) => N,
    isGlobalBlock = false
) => {
    return (node: N, visitor: ts.Visitor, context: CustomContextType): N => {
        const usedIdentifiersCache = context.usedIdentifiers || new Map();
        context.usedIdentifiers = new Map();
        const getVariableUniqueIdentifierCache = context.getVariableUniqueIdentifier
        const variableState: VariableStateType = {
            blockScopeIdentifiers: undefined,
            globalScopeIdentifiers: undefined,
        }
        context.getVariableUniqueIdentifier = (flag: ts.NodeFlags) => {

            if (isGlobalBlock) {

                return variableState.globalScopeIdentifiers ||= context.factory.createUniqueName("_");
            }
            if (flag === ts.NodeFlags.None) {

                return getVariableUniqueIdentifierCache(flag);
            }
            return variableState.blockScopeIdentifiers ||= context.factory.createUniqueName("_");
        };
        const visitedNode = nodeVisitor(node, visitor, context, variableState);

        context.getVariableUniqueIdentifier = getVariableUniqueIdentifierCache;



        context.usedIdentifiers.forEach((value, key) => {
            const cachedIdentifierState = usedIdentifiersCache.get(key);
            if (value.declaredFlag === undefined && (value.isChanged || value.isJsx)) {
                if (cachedIdentifierState) {
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

            }
        });


        context.usedIdentifiers = usedIdentifiersCache;
        return visitedNode;
    }
}
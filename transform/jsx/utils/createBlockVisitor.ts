import ts from "typescript";
import { CustomContextType } from "../..";
import { creteManageIdentifierState } from "./getIdentifierState";

export type VariableStateType = {
    blockScopeIdentifiers?: ReturnType<CustomContextType["getVariableUniqueIdentifier"]>
    globalScopeIdentifiers?: ReturnType<CustomContextType["getVariableUniqueIdentifier"]>

}

export const createBlockVisitor = <N extends any, R extends any>(
    nodeVisitor: (node: N, visitor: ts.Visitor, context: CustomContextType) => R,
    isGlobalBlock: boolean
) => {
    return (node: N, visitor: ts.Visitor, context: CustomContextType): [R, VariableStateType] => {

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
        const visitedNode = creteManageIdentifierState(context, isGlobalBlock, () => {

            return nodeVisitor(node, visitor, context);
        });

        context.getVariableUniqueIdentifier = getVariableUniqueIdentifierCache;





        return [visitedNode, variableState]
    }
}
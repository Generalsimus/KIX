import ts from "typescript";
import { CustomContextType } from "../..";
import { creteManageIdentifierState } from "./getIdentifierState";

export type VariableStateType = {
    blockScopeIdentifiers?: ReturnType<CustomContextType["getVariableUniqueIdentifier"]>
    globalScopeIdentifiers?: ReturnType<CustomContextType["getVariableUniqueIdentifier"]>

}
// V extends (node: N) => any
// export const createBlockVisitor = <N extends ts.Node | ts.Node[], R = N>(
//     // visitSafe: V,
//     nodeVisitor: (
//         node: N,
//         nodeVisitor: ts.Visitor,
//         context: CustomContextType,
//         variableState: VariableStateType
//     ) => R,
//     isGlobalBlock = false
// ) => {
//     return (node: N, visitor: ts.Visitor, context: CustomContextType) => {
//         // const usedIdentifiersCache = context.usedIdentifiers || new Map();
//         // context.usedIdentifiers = new Map();
//         const getVariableUniqueIdentifierCache = context.getVariableUniqueIdentifier
//         const variableState: VariableStateType = {
//             blockScopeIdentifiers: undefined,
//             globalScopeIdentifiers: undefined,
//         }
//         context.getVariableUniqueIdentifier = (flag: ts.NodeFlags) => {

//             if (isGlobalBlock) {

//                 return variableState.globalScopeIdentifiers ||= context.factory.createUniqueName("_");
//             }
//             if (flag === ts.NodeFlags.None) {

//                 return getVariableUniqueIdentifierCache(flag);
//             }
//             return variableState.blockScopeIdentifiers ||= context.factory.createUniqueName("_");
//         };

//         // creteManageIdentifierState(context, () => {
//         //     // ts.visitEachChild(node,)
//         //     // if (node instanceof Array) {

//         //     // }
//         //     return visitor(node)
//         //     // return nodeVisitor(node, visitor, context, variableState);
//         // })

//         const visitedNode = nodeVisitor(node, visitor, context, variableState);



//         context.getVariableUniqueIdentifier = getVariableUniqueIdentifierCache;

//         // if (variableState.globalScopeIdentifiers) {



//         return visitedNode;
//     }
// }







export const newBlockVisitor = <N extends ts.Node | ts.Node[] | ts.NodeArray<ts.Node>, R extends any>(
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
        const visitedNode = creteManageIdentifierState(context, () => {

            return nodeVisitor(node, visitor, context);
        });

        context.getVariableUniqueIdentifier = getVariableUniqueIdentifierCache;

        // const visitedNode = nodeVisitor(node, visitor, context, variableState);




        return [visitedNode, variableState]
    }
}
// export const globalBlockVisitor = newBlockVisitor(<N extends ts.Node>(node: N, visitor: ts.Visitor, context: CustomContextType) => {
//     return ts.visitEachChild(node, visitor, context);
// }, true);

// export const blockVisitor = newBlockVisitor(<N extends ts.Node>(node: N, visitor: ts.Visitor, context: CustomContextType) => {
//     return ts.visitEachChild(node, visitor, context);
// }, false);
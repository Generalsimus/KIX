// TransformersObjectType

import ts from "typescript";
import { CustomContextType, VariableDeclarationNodeType } from "..";
import { updateArrowFunction } from "./updateArrowFunction";
import { updateBlock } from "./updateBlock";
import { updateFunctionDeclaration } from "./updateFunctionDeclaration";
import { updateFunctionExpression } from "./updateFunctionExpression";
import { updateMethodDeclaration } from "./updateMethodDeclaration";

export const BlockNodeKind = [
    ts.SyntaxKind.ArrowFunction,
    ts.SyntaxKind.FunctionExpression,
    ts.SyntaxKind.MethodDeclaration,
    ts.SyntaxKind.FunctionDeclaration
]

// let cacheBlockReplaceNodes: CustomContextType["blockNodesLobby"] = new Set();
export const initSubstitutionTransformData = {
    [ts.SyntaxKind.SourceFile]: (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
        // context.blockNodesLobby = new Set();
        context.substituteNodesList = new Map();
        // cacheBlockReplaceNodes = new Set();
        return node
    }
}









// export const substituteBlockTransformerBeforeVisit = BlockNodeKind.reduce((transformObject, nextVisit) => {
//     (transformObject as any)[nextVisit] = (node: ts.Node, visitor: ts.Visitor, context: CustomContextType) => {
//         // cacheBlockReplaceNodes = context.blockNodesLobby;
//         // context.blockNodesLobby = new Set();


//         return node
//     }
//     return transformObject
// }, {} as any);



// export const substituteBlockTransformerAfterVisit = BlockNodeKind.reduce((transformObject, nextVisit) => {
//     (transformObject as any)[nextVisit] = (node: ts.Node, visitor: ts.Visitor, context: CustomContextType) => {


//         // const blockNodesLobby = context.blockNodesLobby;

//         // blockNodesLobby

//         // console.log("🚀 --> file: --> blockNodesLobby", blockNodesLobby.size);

//         // console.log("🚀 --> file: --> node.kind", ts.SyntaxKind[node.kind], context.substituteBlockNodes.size);
//         // if (context.substituteBlockNodes.size > 0) {
//         //     context.enableSubstitution(node.kind);


//         // const substituteBlockNodes = context.substituteBlockNodes





//         // FunctionExpression
//         // ts.SyntaxKind.FunctionExpression
//         // context.substituteNodesList.set(node, () => {


//         //     switch (node.kind) {
//         //         case ts.SyntaxKind.ArrowFunction:
//         //             return updateArrowFunction(node as ts.ArrowFunction, substituteBlockNodes, context);
//         //         case ts.SyntaxKind.FunctionExpression:
//         //             return updateFunctionExpression(node as ts.FunctionExpression, substituteBlockNodes, context);
//         //         case ts.SyntaxKind.MethodDeclaration:
//         //             return updateMethodDeclaration(node as ts.MethodDeclaration, substituteBlockNodes, context);
//         //         case ts.SyntaxKind.FunctionDeclaration:
//         //             return updateFunctionDeclaration(node as ts.FunctionDeclaration, substituteBlockNodes, context);


//         //         // update
//         //         // updateFunctionExpression
//         //         // case ts.SyntaxKind.Block:
//         //         //     return updateBlock(node as ts.Block, substituteBlockNodes, context);
//         //         // return updateSourceFile(node as ts.SourceFile, substituteBlockNodes, context);
//         //     }

//         //     return node
//         // });

//         //     console.log("🚀 --> file --> node", context.substituteNodesList.size);



//         // }



//         // context.blockNodesLobby = cacheBlockReplaceNodes;

//         return node;
//     }
//     return transformObject
// }, {} as any);

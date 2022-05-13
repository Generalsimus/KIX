// TransformersObjectType

import ts from "typescript";
import { CustomContextType } from "..";
import { updateBlock } from "./updateBlock";

export const BlockNodeKind = [ts.SyntaxKind.Block]

let cacheBlockReplaceNodes = new Map();
export const initSubstitutionTransformData = {
    [ts.SyntaxKind.SourceFile]: (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
        context.substituteBlockNodes = new Map();
        context.substituteNodesList = new Map();
        cacheBlockReplaceNodes = new Map();
        return node
    }
}









export const substituteBlockTransformerBeforeVisit = BlockNodeKind.reduce((transformObject, nextVisit) => {
    (transformObject as any)[nextVisit] = (node: ts.Node, visitor: ts.Visitor, context: CustomContextType) => {
        cacheBlockReplaceNodes = context.substituteBlockNodes;
        context.substituteBlockNodes = new Map();
        console.log("AAAA");
        return node
    }
    return transformObject
}, {} as any);



export const substituteBlockTransformerAfterVisit = BlockNodeKind.reduce((transformObject, nextVisit) => {
    (transformObject as any)[nextVisit] = (node: ts.Node, visitor: ts.Visitor, context: CustomContextType) => {


        console.log("BBBB", context.substituteBlockNodes.size);
        if (context.substituteBlockNodes.size > 0) {
            console.log("🚀 --> file: --> context.substituteBlockNodes.size", context.substituteBlockNodes.size);
            context.enableSubstitution(node.kind);


            const substituteBlockNodes = context.substituteBlockNodes


            switch (node.kind) {
                case ts.SyntaxKind.Block:
                    return updateBlock(node as ts.Block, substituteBlockNodes, context);
            }
            context.substituteNodesList.set(node, () => {

                switch (node.kind) {

                    case ts.SyntaxKind.ArrowFunction:
                    //         case ts.SyntaxKind.Block:
                    //             return updateBlock(node as ts.Block, substituteBlockNodes, context);
                    //         // return updateSourceFile(node as ts.SourceFile, substituteBlockNodes, context);
                }

                //     return node
            });

            console.log("🚀 --> file --> node", context.substituteNodesList.size);



        }



        context.substituteBlockNodes = cacheBlockReplaceNodes;

        return node;
    }
    return transformObject
}, {} as any);

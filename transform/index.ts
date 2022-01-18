import ts, { visitEachChild } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { concatTransformers } from "./concatTransformers";
import { moduleTransformer } from "./module";


export type TransformersObjectType = typeof moduleTransformer
// export type VisitorFuncType = ()=>
export type CustomContextType = ts.TransformationContext & {
    currentModuleInfo: ModuleInfoType
}

export const getTransformer = () => {
    const transforms = concatTransformers([moduleTransformer])
    // console.log("🚀 --> file: index.ts --> line 15 --> getTransformer --> transforms", transforms);


    return {
        before: [
            (context: ts.TransformationContext) => {
                // (transpilerBefore[NODE.kind] || visitEachChild)(NODE, visitor, CTX)
                // const visitor = (node: ts.Node): ts.Node | undefined => {

                //     return ts.forEachChild(node, visitor,);
                // }
                const visitor = (node: ts.Node): ts.Node => {
                console.log("🚀 --> file: index.ts --> line 27 --> getTransformer --> SyntaxKind", ts.SyntaxKind[node.kind]);

                    return ((transforms as any)[node.kind] || visitEachChild)(node, visitor, context)
                }
                return visitor as any
                // return (node: ts.SourceFile) => ts.visitNode(node, visitor)

            }
        ],
        // before: [
        //     (context: ts.TransformationContext) => {

        //         const visitor = (node: ts.Node): ts.Node | undefined => ((transforms as any)[node.kind] || visitEachChild)(node, visitor, context)
        //         // return visitor
        //         return (node: ts.Node ): ts.Node  => ts.visitNode(node, visitor)

        //     }
        // ],
        // after: [
        //     (CTX) => {
        //         const visitor = (NODE) => {

        //             // console.log(SyntaxKind[NODE.kind])

        //             return (transpilerAfter[NODE.kind] || visitEachChild)(NODE, visitor, CTX)
        //         }

        //         return visitor
        //     }
        // ]
    }
    // }
    // return ts.transform(
    //     sourceFile,
    //     [
    //         (context) => {
    //             // (transpilerBefore[NODE.kind] || visitEachChild)(NODE, visitor, CTX)
    //             const visitor = (node: ts.Node): ts.Node | undefined => {

    //                 return ts.forEachChild(node, visitor,);
    //             }
    //             return visitor as any
    //             // return (node) => ts.visitNode(node, visitor)

    //         }
    //     ],
    //     compilerOptions
    // );
}
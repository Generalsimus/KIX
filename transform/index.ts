import ts, { visitEachChild } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { concatTransformers } from "./concatTransformers";
import { moduleTransformer } from "./module";


export type TransformersObjectType = typeof moduleTransformer

export type CustomContextType = ts.TransformationContext & {
    currentModuleInfo: ModuleInfoType
}

export const getTransformer = () => {
    const transforms = concatTransformers([moduleTransformer])
    


    return {
        before: [
            (context: ts.TransformationContext) => {
                // (transpilerBefore[NODE.kind] || visitEachChild)(NODE, visitor, CTX)
                // const visitor = (node: ts.Node): ts.Node | undefined => {

                //     return ts.forEachChild(node, visitor,);
                // }
                const visitor = (node: ts.Node): ts.Node => {
                    // console.log("🚀 --> file: index.ts --> line 27 --> getTransformer --> SyntaxKind", ts.SyntaxKind[node.kind]);

                    return ((transforms as any)[node.kind] || visitEachChild)(node, visitor, context)
                }
                return visitor as any
                // return (node: ts.SourceFile) => ts.visitNode(node, visitor)

            }
        ] 
    }

}
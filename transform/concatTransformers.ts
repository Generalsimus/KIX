import ts from "typescript"
import { TransformersObjectType } from "./index"

export const concatTransformers = (transformers: TransformersObjectType[], transform = {}): TransformersObjectType => {


    for (const transformersObject of transformers) {
        for (const SyntaxKindKey in transformersObject) {
            if (SyntaxKindKey in transform) {
                const transformer = (transform as any)[SyntaxKindKey]
                const newTransformer = (transformersObject as any)[SyntaxKindKey]


                    (transform as any)[SyntaxKindKey] = (node: ts.Node, ...args: any[]) => (newTransformer as any)((transformer as any)(node, ...args), ...args)

            } else {
                (transform as any)[SyntaxKindKey] = (transformersObject as any)[SyntaxKindKey]

            }
        }

    }
    // console.log("🚀 --> file: concatTransformers.ts --> line 25 --> concatTransformers --> transform", transform);
    return transform as TransformersObjectType
}


// const concatBeforOrAfterTransformers = (BeforeOrAfter, transfromers = {}) => {
//     for (const transformersObject of BeforeOrAfter) {
//         for (const transfromersKey in transformersObject)
//             if (transfromersKey in transfromers) {
//                 const transfromer = transfromers[transfromersKey]
//                 const newtransfromer = transformersObject[transfromersKey]
//                 transfromers[transfromersKey] = (node, ...args) => newtransfromer(transfromer(node, ...args), ...args)
//             } else {
//                 transfromers[transfromersKey] = transformersObject[transfromersKey]
//             }
//     }
//     return transfromers
// }

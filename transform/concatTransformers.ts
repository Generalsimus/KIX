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
    
    return transform as TransformersObjectType
}

 
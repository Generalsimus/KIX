import ts from "typescript"
import { TransformersObjectType } from "./index"

export const concatTransformers = (...transformers: Partial<TransformersObjectType>[]): TransformersObjectType => {
    const transform = {}

    for (const transformersObject of transformers) {
        for (const SyntaxKindKey in transformersObject) {
            if (SyntaxKindKey in transform) {
                const transformer = (transform as any)[SyntaxKindKey]
                const newTransformer = (transformersObject as any)[SyntaxKindKey];


                (transform as any)[SyntaxKindKey] = (node: ts.Node, ...args: any[]) => {
                    const newNode = transformer(node, ...args);
                    if (newNode) {
                        if (String(newNode.kind) === SyntaxKindKey) {
                            return newTransformer(newNode, ...args);
                        } else if (newNode.kind in transform) {
                            return (transform as any)[newNode.kind](newNode, ...args);
                        } else {
                            return newNode;
                        }
                    }
                }

            } else {
                (transform as any)[SyntaxKindKey] = (transformersObject as any)[SyntaxKindKey]

            }
        }

    }

    return transform as TransformersObjectType
}


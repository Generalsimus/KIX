import ts, { visitEachChild } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { concatTransformers } from "./concatTransformers";
import { moduleTransformer } from "./module";
import { jsxTransformers } from "./jsx"

export type TransformersObjectType = typeof moduleTransformer & typeof jsxTransformers;

export type CustomContextType = ts.TransformationContext & {
    currentModuleInfo: ModuleInfoType
}

export const getTransformer = () => {
    const transformsBefore = concatTransformers(jsxTransformers, moduleTransformer)
    const transformsAfter = concatTransformers()

    const getVisitor = (transforms: TransformersObjectType) => (context: ts.TransformationContext) => {

        const visitor = (node: ts.Node): ts.Node => {


            return ((transforms as any)[node.kind] || visitEachChild)(node, visitor, context)
        }
        return visitor as any

    }

    return {
        before: [
            getVisitor(transformsBefore)
        ],
        after: [
            getVisitor(transformsAfter)
        ]
    }

}
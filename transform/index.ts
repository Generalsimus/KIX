import ts, { visitEachChild } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { concatTransformers } from "./concatTransformers";
import { moduleTransformerBefore, moduleTransformerAfter } from "./module";
import { jsxTransformers } from "./jsx"

export type TransformersObjectType = typeof moduleTransformerBefore & typeof jsxTransformers & typeof moduleTransformerAfter;

export type CustomContextType = ts.TransformationContext & {
    currentModuleInfo: ModuleInfoType
    getJSXPropRegistrationIdentifier?: () => ts.Identifier
}

export const getTransformer = () => {
    const transformsBefore = concatTransformers(jsxTransformers, moduleTransformerBefore)
    const transformsAfter = concatTransformers(moduleTransformerAfter)

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
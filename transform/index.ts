import ts, { visitEachChild } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { concatTransformers } from "./concatTransformers";
import { moduleTransformerBefore } from "./module";
import { jsxTransformers } from "./jsx"
import { globalTransformersAfter, globalTransformersBefore } from "./global";

export type TransformersObjectType = typeof moduleTransformerBefore & typeof jsxTransformers & typeof globalTransformersBefore;

export type CustomContextType = ts.TransformationContext & {
    currentModuleInfo: ModuleInfoType
    /*   ფროფერთის სადეკლარაციო Identifier-ი */
    getJSXPropRegistrationIdentifier?: () => ts.Identifier
}

export const getTransformer = () => {
    const transformsBefore = concatTransformers(globalTransformersBefore, moduleTransformerBefore, jsxTransformers)
    const transformsAfter = concatTransformers(globalTransformersAfter)

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
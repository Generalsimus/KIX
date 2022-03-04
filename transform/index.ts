import ts, { visitEachChild } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { concatTransformers } from "./concatTransformers";
import { jsxTransformers } from "./jsx";
import { moduleTransformerAfter, moduleTransformerBefore } from "./module"; 

export type TransformersObjectType = Partial<typeof jsxTransformers & typeof moduleTransformerBefore & typeof moduleTransformerAfter>

export type CustomContextType = ts.TransformationContext & {
    currentModuleInfo: ModuleInfoType
    /*   ფროფერთის სადეკლარაციო Identifier-ი */
    getJSXPropRegistrationIdentifier?: () => ts.Identifier
    getVariableDeclarationStateNameIdentifier: () => ts.Identifier
    getVariableDeclarationNames: () => Record<string, string[]>
}

export const getTransformer = () => {
    const transformsBefore =   concatTransformers(moduleTransformerBefore, jsxTransformers);
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
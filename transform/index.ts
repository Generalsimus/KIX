import ts, { visitEachChild } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { concatTransformers } from "./concatTransformers";
import { moduleTransformerBefore, moduleTransformerAfter } from "./module";
import { jsxTransformers } from "./jsx"
import { globalTransformersAfter, globalTransformersBefore } from "./global";

export type TransformersObjectType = typeof moduleTransformerBefore & typeof jsxTransformers & typeof moduleTransformerAfter;

export type CustomContextType = ts.TransformationContext & {
    currentModuleInfo: ModuleInfoType
    /* პირველი ფროფერთის სადეკლარაციო Identifier-ი */
    getJSXPropRegistrationIdentifier?: () => ts.Identifier
    /* პირველი ფროფერთის სადეკლარაციო Identifier-ი სა call ფუნქციიის სახელის Identifier-ი */
    getJSXRegistrationDeclarationIdentifier: () => ts.Identifier
}

export const getTransformer = () => {
    const transformsBefore = concatTransformers(globalTransformersBefore, moduleTransformerBefore, jsxTransformers)
    const transformsAfter = concatTransformers(globalTransformersAfter, moduleTransformerAfter)

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
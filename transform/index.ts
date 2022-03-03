import ts, { visitEachChild } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { transformBefore, transformAfter } from "./transformer";

export type TransformersObjectType = Partial<typeof transformBefore & typeof transformAfter>

export type CustomContextType = ts.TransformationContext & {
    currentModuleInfo: ModuleInfoType
    /*   ფროფერთის სადეკლარაციო Identifier-ი */
    getJSXPropRegistrationIdentifier?: () => ts.Identifier
    getVariableDeclarationStateNameIdentifier: () => ts.Identifier
    getVariableDeclarationNames: () => Record<string, string[]>
}

export const getTransformer = () => {
    const transformsBefore = transformBefore
    // concatTransformers(moduleTransformerBefore, jsxTransformers, jsxDeclarationTransformers);
    const transformsAfter = transformAfter
    //  concatTransformers(moduleTransformerAfter)

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
import ts, { visitEachChild, visitIterationBody } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { concatTransformers } from "./concatTransformers";
import { jsxTransformers } from "./jsx";
import { moduleTransformerAfter, moduleTransformerBefore } from "./module";
import { getVisitor } from "./utils/getVisitor";

export type TransformersObjectType = Partial<typeof jsxTransformers & typeof moduleTransformerBefore & typeof moduleTransformerAfter>
type DeclarationType = Record<string, {
    replace: (node: ts.Node) => void
    Identifiers: ts.Node[],
}>
// Map<string, {
//     replace: (node: ts.Node) => void
//     Identifiers: ts.Node[],
// }>
export type CustomContextType = ts.TransformationContext & {
    currentModuleInfo: ModuleInfoType
    /*   ფროფერთის სადეკლარაციო Identifier-ი */
    getJSXPropRegistrationIdentifier?: () => ts.Identifier
    getVariableDeclarationStateNameIdentifier: () => ts.Identifier
    getVariableDeclarationNames: () => Record<string, () => void>
    /* JSX ში მოთავხებული .? უსაფრთხოებისთვის როდესაც ხდება რეგისტრაცია და ასევესაჭიროა მისი გაშვებაც ნიმუში: ssss?.() */
    JsxHaveQuestionDotToken?: ts.Node
    currentParentAstNode?: ts.Node
    variableDeclarationStatement: {
        var: DeclarationType
        const: DeclarationType
        let: DeclarationType
    }
}

export const getTransformer = () => {
    const transformsBefore = concatTransformers(moduleTransformerBefore, jsxTransformers);
    const transformsAfter = concatTransformers(moduleTransformerAfter)



    return {
        before: [
            getVisitor(transformsBefore)
        ],
        after: [
            getVisitor(transformsAfter)
        ]
    }

}
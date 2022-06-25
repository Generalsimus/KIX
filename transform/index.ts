import ts, { visitEachChild, visitIterationBody } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { concatTransformers } from "./concatTransformers";
import { jsxTransformers } from "./jsx";
import { moduleTransformerAfter, moduleTransformerBefore } from "./module";
import { getVisitor } from "./utils/getVisitor";



export type VisitEachType = <N extends ts.Node>(node: N, nodeVisitor: ts.Visitor, context: CustomContextType) => N
export type IdentifiersStateType = {
    isJsx: boolean,
    isChanged: boolean,
    declaredFlag: ts.NodeFlags | undefined,
    substituteCallback: (indexIdToUniqueString: string, declarationIdentifier: ts.Identifier) => void,
}
export type CustomContextType = ts.TransformationContext & {
    currentModuleInfo: ModuleInfoType
    /*   ფროფერთის სადეკლარაციო Identifier-ი */
    getJSXPropRegistrationIdentifier?: () => ts.Identifier
    /* JSX ში მოთავხებული .? უსაფრთხოებისთვის როდესაც ხდება რეგისტრაცია და ასევესაჭიროა მისი გაშვებაც ნიმუში: ssss?.() */
    JsxHaveQuestionDotToken?: ts.Node

    usedIdentifiers: Map<string, IdentifiersStateType>
    getVariableUniqueIdentifier: (flag: ts.NodeFlags) => ts.Identifier
    substituteNodesList: Map<ts.Node, () => ts.Node>

}

export type TransformersObjectType = Partial<
    typeof moduleTransformerBefore &
    typeof jsxTransformers &
    typeof moduleTransformerAfter
>
export const getTransformer = () => {
    const transformsBefore = concatTransformers(
        moduleTransformerBefore,
        jsxTransformers,
    );
    const transformsAfter = concatTransformers(moduleTransformerAfter)


    return {
        before: [
            getVisitor(transformsBefore) as any
        ],
        after: [
            getVisitor(transformsAfter) as any
        ]
    }

}
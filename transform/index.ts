import ts, { visitIterationBody } from "typescript";
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
export type declaredBlockIdentifiersType = Map<string, IdentifiersStateType>
export interface CustomContextType extends ts.TransformationContext {
    currentModuleInfo: ModuleInfoType
    /*   ფროფერთის სადეკლარაციო Identifier-ი */
    getJSXPropRegistrationIdentifier?: () => ts.Identifier
    /* JSX ში მოთავხებული .? უსაფრთხოებისთვის როდესაც ხდება რეგისტრაცია და ასევესაჭიროა მისი გაშვებაც ნიმუში: ssss?.() */
    JsxHaveQuestionDotToken?: ts.Node


    // globalBlockId: number
    // blockId: number
    getVariableUniqueIdentifier: (flag: ts.NodeFlags) => ts.Identifier
    substituteNodesList: Map<ts.Node, () => ts.Node>



    identifiersChannelCallback: (blockDeclaredIdentifiers: declaredBlockIdentifiersType) => void
    addDeclaredIdentifierState: (identifierName: string) => void
    addIdentifiersChannelCallback: (identifierName: string, addCallback: (identifierState: IdentifiersStateType) => void) => void
}


// const docCookies = new Proxy({ ss: 1 }, {})
export type TransformersObjectType = Partial<
    typeof moduleTransformerBefore &
    typeof jsxTransformers &
    typeof moduleTransformerAfter
>
export const getTransformer = () => {
    const transformsBefore = concatTransformers(
        moduleTransformerBefore,
    );
    const transformsAfter = concatTransformers(jsxTransformers, moduleTransformerAfter)

    // const { onSubstituteNode } = context
    return {
        before: [
            getVisitor(transformsBefore, false) as any
        ],
        after: [
            getVisitor(transformsAfter, true) as any
        ]
    }

}
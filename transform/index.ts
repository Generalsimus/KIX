import ts, { visitIterationBody } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { concatTransformers } from "./concatTransformers";
import { jsxTransformers } from "./jsx";
import { moduleTransformerAfter, moduleTransformerBefore } from "./module";
// import { moduleTransformerAfter, moduleTransformerBefore } from "./module";
import { visitSourceFileBefore, visitSourceFilesAfter } from "./module/sourceFile";
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



    identifiersChannelCallback: (blockDeclaredIdentifiers: declaredBlockIdentifiersType, isGlobalBlock: boolean) => void
    addDeclaredIdentifierState: (identifierName: string) => void
    addIdentifiersChannelCallback: (identifierName: string, addCallback: (identifierState: IdentifiersStateType) => void) => void
}

// export interface Node<TKind extends ts.SyntaxKind> extends ts.Node {
//     readonly kind: TKind;
// }

// Partial<{
//     [K in ts.SyntaxKind]: <N extends Node<K>>(node: N, visitor: ts.Visitor, context: CustomContextType) => ts.VisitResult<ts.Node>
// }>
export type TransformersObjectType = Partial<
    typeof moduleTransformerBefore &
    typeof moduleTransformerAfter &
    typeof jsxTransformers
>
export const getTransformer = (): ts.CustomTransformers => {
    const transformsBefore = concatTransformers(
        jsxTransformers,
        moduleTransformerBefore,
    );
    const transformsAfter = concatTransformers(moduleTransformerAfter);

    return {
        before: [
            getVisitor(transformsBefore) as any
        ],
        after: [
            getVisitor(transformsAfter) as any
        ]
    }

}
import ts from "typescript";
import { jsxTransformers } from "./jsx";
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
    getJSXPropRegistrationIdentifier?: () => ts.Identifier
    /* JSX ში მოთავხებული .? უსაფრთხოებისთვის როდესაც ხდება რეგისტრაცია და ასევესაჭიროა მისი გაშვებაც ნიმუში: ssss?.() */
    JsxHaveQuestionDotToken?: ts.Node


    getVariableUniqueIdentifier: (flag: ts.NodeFlags) => ts.Identifier
    substituteNodesList: Map<ts.Node, (node: ts.Node, substituteVisitor: ts.Visitor, context: ts.Visitor) => ts.Node | ts.Node[]>



    addDeclaredIdentifierState: (identifierName: string, identifierState?: IdentifiersStateType) => void
    addIdentifiersChannelCallback: (identifierName: string, addCallback: (identifierState: IdentifiersStateType) => void) => void
}


const jsxTransformerContent: ts.CustomTransformers = {
    before: [
        getVisitor(jsxTransformers) as any,
    ]
}

export const getTransformers = (): ts.CustomTransformers => jsxTransformerContent

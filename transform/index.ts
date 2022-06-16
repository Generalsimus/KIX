import ts, { visitEachChild, visitIterationBody } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { concatTransformers } from "./concatTransformers";
import { jsxTransformers } from "./jsx";
// import { BlockVariableStatementReplaceType } from "./jsx/utils/updateSubstitutions/VariableStatement";
import { moduleTransformerAfter, moduleTransformerBefore } from "./module";
// import { initSubstitutionTransformData } from "./substitute-blocks";
import { getVisitor } from "./utils/getVisitor";


// export type BlockNodeType = ts.ArrowFunction |
//     ts.FunctionDeclaration |
//     ts.FunctionExpression |
//     ts.IfStatement |
//     ts.SwitchStatement |
//     ts.TryStatement |
//     ts.MethodDeclaration |
//     ts.ClassStaticBlockDeclaration;

// export type VariableDeclarationNodeType = {
//     variableStatements: ts.VariableStatement,
//     variableDeclaration: ts.VariableDeclaration
// }
// export type ParameterDeclarationNodeType = {
//     variableStatements: ts.ParameterDeclaration,
// }
// export type variableDeclarationType = VariableDeclarationNodeType | ParameterDeclarationNodeType
// export type VariableDeclarationStatementItemType = {
//     identifiersIndex: number,
//     identifierName: string,
//     isJsxIdentifier: boolean,
//     valueChanged: boolean,
//     variableDeclaration?: variableDeclarationType,
//     blockNode?: BlockNodeType,
//     substituteIdentifiers: Map<ts.Node, () => ts.Node>
//     getEqualNode: (node: ts.Expression | string) => ts.Expression
// };
// 
// export type VariableDeclarationStatementItemListType = Set<VariableDeclarationStatementItemType>

// export type SubstituteVariableStatementDataType = Map<VariableDeclarationNodeType["variableStatements"], {
//     addAfterVariableDeclaration: Map<ts.VariableDeclaration, VariableDeclarationStatementItemListType>
// }> & Map<ParameterDeclarationNodeType["variableStatements"], {
//     addAfterParameterDeclaration: VariableDeclarationStatementItemListType
// }>
export type VisitEachType = <N extends ts.Node>(node: N, nodeVisitor: ts.Visitor, context: CustomContextType) => N
export type IdentifiersStateType = {
    // name: string,
    // indexId: number,
    isJsx: boolean,
    isChanged: boolean,
    declaredFlag: ts.NodeFlags | undefined,
    // getBlockVariableStateUniqueIdentifier?: CustomContextType["getBlockVariableStateUniqueIdentifier"],
    substituteCallback: (indexId: number, declarationIdentifier: ts.Identifier) => void,
    // substituteIdentifiers: CustomContextType["substituteNodesList"],
    // declarationMarker?: ts.Identifier
}
export type CustomContextType = ts.TransformationContext & {
    currentModuleInfo: ModuleInfoType
    /*   ფროფერთის სადეკლარაციო Identifier-ი */
    getJSXPropRegistrationIdentifier?: () => ts.Identifier
    // getVariableDeclarationStateNameIdentifier: () => ts.Identifier
    /* JSX ში მოთავხებული .? უსაფრთხოებისთვის როდესაც ხდება რეგისტრაცია და ასევესაჭიროა მისი გაშვებაც ნიმუში: ssss?.() */
    JsxHaveQuestionDotToken?: ts.Node

    usedIdentifiers: Map<string, IdentifiersStateType>
    getVariableUniqueIdentifier: (flag: ts.NodeFlags) => ts.Identifier
    // getGlobalVariableStateUniqueIdentifier: () => ts.Identifier
    substituteNodesList: Map<ts.Node, () => ts.Node>

}

export type TransformersObjectType = Partial<
    typeof jsxTransformers &
    typeof moduleTransformerBefore &
    typeof moduleTransformerAfter
>
export const getTransformer = () => {
    const transformsBefore = concatTransformers(
        // initSubstitutionTransformData,
        moduleTransformerBefore as any,
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
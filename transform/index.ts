import ts, { visitEachChild, visitIterationBody } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { concatTransformers } from "./concatTransformers";
import { jsxTransformers } from "./jsx";
// import { BlockVariableStatementReplaceType } from "./jsx/utils/updateSubstitutions/VariableStatement";
import { moduleTransformerAfter, moduleTransformerBefore } from "./module";
// import { initSubstitutionTransformData } from "./substitute-blocks";
import { getVisitor } from "./utils/getVisitor";


export type BlockNodeType = ts.ArrowFunction |
    ts.FunctionDeclaration |
    ts.FunctionExpression |
    ts.IfStatement |
    ts.SwitchStatement |
    ts.TryStatement |
    ts.MethodDeclaration |
    ts.ClassStaticBlockDeclaration;

export type VariableDeclarationNodeType = {
    variableStatements: ts.VariableStatement,
    variableDeclaration: ts.VariableDeclaration
}
export type ParameterDeclarationNodeType = {
    variableStatements: ts.ParameterDeclaration,
}
export type variableDeclarationType = VariableDeclarationNodeType | ParameterDeclarationNodeType
export type VariableDeclarationStatementItemType = {
    identifiersIndex: number,
    identifierName: string,
    isJsxIdentifier: boolean,
    valueChanged: boolean,
    variableDeclaration?: variableDeclarationType,
    blockNode?: BlockNodeType,
    substituteIdentifiers: Map<ts.Node, () => ts.Node>
    getEqualNode: (node: ts.Expression | string) => ts.Expression
};

export type VariableDeclarationStatementItemListType = Set<VariableDeclarationStatementItemType>

export type SubstituteVariableStatementDataType = Map<VariableDeclarationNodeType["variableStatements"], {
    addAfterVariableDeclaration: Map<ts.VariableDeclaration, VariableDeclarationStatementItemListType>
}> & Map<ParameterDeclarationNodeType["variableStatements"], {
    addAfterParameterDeclaration: VariableDeclarationStatementItemListType
}>


/*

დეკლარაციის ტიპში ვინახავთ დეკლარაცია და დეკლარაციიის ბლოკის ნოდზე მოსახდენ ცვლილებებს
ლობი გავაკეთოთ და ცვლადების სთეითები შიგნით ვამატოთ
ასევე გავაკეთოთ ერთი ბლოკების შესანახი სადაც იქნება ბლოკში შესატანი ცვლილებების სია

*/

export type CustomContextType = ts.TransformationContext & {
    currentModuleInfo: ModuleInfoType
    /*   ფროფერთის სადეკლარაციო Identifier-ი */
    getJSXPropRegistrationIdentifier?: () => ts.Identifier
    getVariableDeclarationStateNameIdentifier: () => ts.Identifier
    /* JSX ში მოთავხებული .? უსაფრთხოებისთვის როდესაც ხდება რეგისტრაცია და ასევესაჭიროა მისი გაშვებაც ნიმუში: ssss?.() */
    JsxHaveQuestionDotToken?: ts.Node
    // substituteDeclaration:  Map<ts.VariableDeclaration, VariableDeclarationNodeType>,
    // ცვლადის სახელების სთეითმენთი
    variableIdentifiersNameStatement: Map<string, VariableDeclarationStatementItemType>
    // ბლოკის ჩასანაცვლებელი ნოდების სია
    // substituteBlockLobby: Map<ts.VariableStatement, {

    // }>,
    substituteBlockLobby: Set<VariableDeclarationStatementItemType>,
    // substituteBlockLobby: Map<ts.VariableStatement, VariableDeclarationNodeType>,

    // substituteBlockData: Map<ts.ArrowFunction | ts.FunctionDeclaration | ts.FunctionExpression, {
    //     variableStatements: Set<ts.VariableStatement>
    // }>
    substituteNodesList: Map<ts.Node, () => ts.Node>
    substituteNodesData: SubstituteVariableStatementDataType & Map<BlockNodeType, {
        data: SubstituteVariableStatementDataType,
        blockStateIdentifierName: ts.Identifier
    }>
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
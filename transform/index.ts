import ts, { visitEachChild, visitIterationBody } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { concatTransformers } from "./concatTransformers";
import { jsxTransformers } from "./jsx";
// import { BlockVariableStatementReplaceType } from "./jsx/utils/updateSubstitutions/VariableStatement";
import { moduleTransformerAfter, moduleTransformerBefore } from "./module";
// import { initSubstitutionTransformData } from "./substitute-blocks";
import { getVisitor } from "./utils/getVisitor";


export type BlockNodeType = ts.ArrowFunction | ts.FunctionDeclaration | ts.FunctionExpression | ts.IfStatement | ts.SwitchStatement;

export type VariableDeclarationNodeType = {
    variableStatements: ts.VariableStatement,
    variableDeclaration: ts.VariableDeclaration,
}

export type VariableDeclarationStatementItemType = {
    identifiersIndex: number,
    identifierName: string,
    isJsxIdentifier: boolean,
    valueChanged: boolean,
    variableDeclaration?: VariableDeclarationNodeType
    blockNode?: BlockNodeType,
    substituteIdentifiers: Map<ts.Node, () => ts.Node>
    getEqualNode: (node: ts.Expression | string) => ts.Expression
};

export type SubstituteVariableStatementDataType = Map<ts.VariableStatement, {
    replaceDeclarations: Map<ts.VariableDeclaration, Set<VariableDeclarationStatementItemType>>
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
        variableStatementsData: SubstituteVariableStatementDataType
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
import ts, { visitEachChild, visitIterationBody } from "typescript";
import { ModuleInfoType } from "../utils/getModuleInfo";
import { concatTransformers } from "./concatTransformers";
import { jsxTransformers } from "./jsx";
import { moduleTransformerAfter, moduleTransformerBefore } from "./module";
import { initSubstitutionTransformData, substituteBlockTransformerAfterVisit, substituteBlockTransformerBeforeVisit, } from "./substitute-blocks";
import { getVisitor } from "./utils/getVisitor";


export type VariableDeclarationNodeType = {
    declarationStatement: ts.VariableStatement,
    declaration: ts.VariableDeclaration,
}

export type VariableDeclarationStatementItemType<
    D = VariableDeclarationNodeType
    // P = (ts.VariableStatement | ts.ArrowFunction | ts.FunctionDeclaration | ts.FunctionExpression),
    // D = ts.VariableDeclaration
    > = {
        identifiersIndex: number,
        substituteIdentifiers: Map<ts.Node, () => ts.Node>
        isJsxIdentifier: boolean,
        valueChanged: boolean,
        declarationNode?: D
    }
// type DeclarationType = Map<string, ts.Node>
// ts.VariableStatement | ts.ArrowFunction | ts.FunctionDeclaration | ts.FunctionExpression
// type StatementStateData = Record<ts.NodeFlags, DeclarationType>
// type DeclarationFlagKeys = ts.NodeFlags.None | ts.NodeFlags.Const | ts.NodeFlags.Let;
// type FlagsStateCache = Pick<StatementStateData, DeclarationFlagKeys> & Partial<Omit<StatementStateData, DeclarationFlagKeys>>

export type CustomContextType = ts.TransformationContext & {
    currentModuleInfo: ModuleInfoType
    /*   ფროფერთის სადეკლარაციო Identifier-ი */
    getJSXPropRegistrationIdentifier?: () => ts.Identifier
    getVariableDeclarationStateNameIdentifier: () => ts.Identifier
    /* JSX ში მოთავხებული .? უსაფრთხოებისთვის როდესაც ხდება რეგისტრაცია და ასევესაჭიროა მისი გაშვებაც ნიმუში: ssss?.() */
    JsxHaveQuestionDotToken?: ts.Node
    currentParentAstNode?: ts.Node
    substituteBlockNodes: Map<ts.Node, () => ts.Node[]>,
    substituteNodesList: Map<ts.Node, () => ts.Node>
    variableDeclarationStatement: Map<string, VariableDeclarationStatementItemType>
}

export type TransformersObjectType = Partial<
    typeof jsxTransformers &
    typeof moduleTransformerBefore &
    typeof moduleTransformerAfter &
    typeof initSubstitutionTransformData
>
export const getTransformer = () => {
    const transformsBefore = concatTransformers(
        initSubstitutionTransformData,
        substituteBlockTransformerBeforeVisit,
        moduleTransformerBefore,
        jsxTransformers,
        substituteBlockTransformerAfterVisit,
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
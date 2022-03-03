import ts, { visitEachChild } from "typescript";
import { CustomContextType } from "..";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";

export const VariableStatement = (node: ts.VariableStatement, visitor: ts.Visitor, context: CustomContextType) => {
    // console.log("🚀 --> file: VariableDeclarationList.ts --> line 5 --> VariableDeclarationList --> node", "node");

    // case ts.SyntaxKind.VariableStatement:
    //     if (ifHaveExportModifier(node)) {
    //         for (const variableDeclaration of node.declarationList.declarations) {
    const getAlreadyDeclaredVariableDeclarationNames = context.getVariableDeclarationNames
    context.getVariableDeclarationNames = (declarationNames = { ...getAlreadyDeclaredVariableDeclarationNames() }) => {
        for (const variableDeclaration of node.declarationList.declarations) {

            const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);
            declarationNames = { ...declarationNames, ...declarationNamesObject }
        }
        return declarationNames
    }

    // console.log(context.getVariableDeclarationNames())
    return visitEachChild(node, visitor, context)
}
import ts, { visitEachChild } from "typescript";
import { CustomContextType } from "..";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";

export const VariableStatement = (node: ts.VariableStatement, visitor: ts.Visitor, context: CustomContextType) => {
    // console.log("🚀 --> file: VariableDeclarationList.ts --> line 5 --> VariableDeclarationList --> node", "node");

    // case ts.SyntaxKind.VariableStatement:
    //     if (ifHaveExportModifier(node)) {
    //         for (const variableDeclaration of node.declarationList.declarations) {
    // const getAlreadyDeclaredVariableDeclarationNames = context.getVariableDeclarationNames
    // context.getVariableDeclarationNames = (declarationNames = { ...getAlreadyDeclaredVariableDeclarationNames() }) => {
    //     for (const variableDeclaration of node.declarationList.declarations) {

    //         const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);
    //         declarationNames = { ...declarationNames, ...declarationNamesObject }
    //     }
    //     return declarationNames
    // }

    // console.log(context.getVariableDeclarationNames())
    const getContextVariableDeclarationNames = context.getVariableDeclarationNames;
    // const rrrrrrr: ts.Node[] = []
    // context.getVariableDeclarationNames = () => {
    //     const currentDeclarationNames = getContextVariableDeclarationNames();
    //     const returnValue = { ...currentDeclarationNames };

    //     // rrrrrrr.push(ts.factory.createIdentifier("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS"));


    //     for (const variableDeclaration of node.declarationList.declarations) {
    //         const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);
    //         //     for (const variableName in declarationNamesObject) {
    //         //         // const expressionTemp = context.factory.createTempVariable(context.hoistVariableDeclaration, /*reservedInNestedScopes*/ true);
    //         //         if (variableName) {
    //         //             returnValue[variableName] = () => {

    //         //                 // return {
    //         //                 //     accessKeys: declarationNamesObject[variableName],
    //         //                 //     updateVariable: () => {

    //         //                 //     }
    //         //                 // }

    //         //             }
    //         //         }
    //         //     }

    //     }

    //     return returnValue;
    // }
    // return
    // return context.factory.getGeneratedNameForNode(node);
    const visited = visitEachChild(node, visitor, context);
    // const hosted = context.factory.createTempVariable(context.hoistVariableDeclaration, /*reservedInNestedScopes*/ true)
    // return context.factory.createTempVariable(context.hoistVariableDeclaration)
    return visited;
    // return hosted;
    // return [
    //     visited,
    //     hosted
    // ];

    // return visitEachChild(node, visitor, context)
    // return [visitEachChild(node, visitor, context)]
    // rrrrrrr.push(visitEachChild(node, visitor, context));
    // return rrrrrrr;
    // return visitEachChild(node, visitor, context)
}
import ts from "typescript";
import { getVariableDeclarationNames } from "../../utils/getVariableDeclarationNames.js";
import {
    elementAccessExpression
} from "../factoryCode/elementAccessExpression";
import {
    nodeToken
} from "../factoryCode/nodeToken";
const factory = ts.factory;

export const exportVisitor = (node) => {
    // const push = (node) => statements.push(factory.createExpressionStatement(node))
    // const returnValue = [node]
    // console.log("🚀 --> file: exportVisitor.js --> line 14 --> exportVisitor --> node.kind", ts.SyntaxKind[node.kind]);
    switch (node.kind) {
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.ClassDeclaration:
            if (ifHaveExportModifier(node)) {
                return [node, factory.createExpressionStatement(nodeToken([
                    elementAccessExpression(["export", "default"]),
                    factory.cloneNode(node.name)
                ]))];
            }
            return [node]
        case ts.SyntaxKind.VariableStatement:
            if (ifHaveExportModifier(node)) {
                for (const variableDeclaration of node.declarationList.declarations) {
                    // getVariableDeclarationNames(variableDeclaration.name)
                    // console.log("🚀 --> --> getVariableDeclarationNames(variableDeclaration.name)", getVariableDeclarationNames(variableDeclaration));
                    // console.log("🚀 --> file: exportVisitor.js --> line 27 --> exportVisitor --> variableDeclaration", ts.SyntaxKind[variableDeclaration.kind]);
                    // return [node, factory.createExpressionStatement(nodeToken([
                    //     elementAccessExpression(["export", "default"]),
                    //     factory.cloneNode(variableDeclaration.name)
                    // ]))];
                }
            }
        // console.log("🚀 --> file: exportVisitor.js --> line 30 --> exportVisitor --> node", node.declarationList.declarations);
        default:
            return [node]
    }
    // factory.createEmptyStatement()
    // console.log("🚀 -->  ortVisitor --> expression", ts.SyntaxKind[node.kind]);
    // if (node.kind !== ts.SyntaxKind.ExpressionStatement) {
    //     return returnValue
    // }
    // const {
    //     expression
    // } = node
    // switch (expression.kind) {
    //     case ts.SyntaxKind.ClassDeclaration:
    //         for (const { kind } of (expression.modifiers || [])) {
    //             if (kind === ts.SyntaxKind.ExportKeyword) {
    //                 returnValue.push(nodeToken([
    //                     elementAccessExpression(["export", "default"]),
    //                     expression.name
    //                 ]))
    //                 break;
    //             }
    //         }
    //         break;
    //     default:
    //         return returnValue
    // }
}
const ifHaveExportModifier = (node) => {
    for (const { kind } of (node.modifiers || [])) {
        if (kind === ts.SyntaxKind.ExportKeyword) {
            return true
        }
    }
    return false
}
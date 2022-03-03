import ts from "typescript";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames.js";
import {
    elementAccessExpression
} from "../factoryCode/elementAccessExpression";
import {
    nodeToken
} from "../factoryCode/nodeToken";
import { getVariableDeclarationNode } from "../utils/getVariableDeclarationNode.js";
import { App } from "../../app/index.js";
const factory = ts.factory;

export const exportVisitor = (node) => {
    //TODO: Aggregating modules დროებით არ მშაობსსსსსსსსსსსსსსსსსსსსსსსსსსსსსსს
    // console.log("🚀 --> file: exportVisitor.js --> line 14 --> exportVisitor --> node.kind", ts.SyntaxKind[node.kind]);
    const returnValue = [node];
    switch (node.kind) {
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.ClassExpression:

            if (ifHaveExportModifier(node)) {
                if (node.name) {
                    /*
                    export default class className { ... }
                    export default function functionName() { ... }
                    */
                    const exportNameOrNode = ifHaveExportModifier(node, ts.SyntaxKind.DefaultKeyword) ? "default" : node.name.getText();
                    returnValue.push(factory.createExpressionStatement(nodeToken([
                        elementAccessExpression(["exports", exportNameOrNode]),
                        factory.cloneNode(node.name)
                    ])))
                } else {
                    // getVariableDeclarationNames(variableDeclaration.name)

                    /*
                    export default class { ... }
                    export default function () { ... }
                    */
                    const declareNAme = factory.getDeclarationName(node)
                    const newNode = factory.cloneNode(node);
                    newNode.name = factory.cloneNode(declareNAme);
                    return [newNode, factory.createExpressionStatement(nodeToken([
                        elementAccessExpression(["exports", "default"]),
                        declareNAme
                    ]))]
                }
            }
            return returnValue
        case ts.SyntaxKind.VariableStatement:
            if (ifHaveExportModifier(node)) {
                for (const variableDeclaration of node.declarationList.declarations) {


                    const declarationNamesObject = getVariableDeclarationNames(variableDeclaration)
                    for (const variableDefinition in declarationNamesObject) {
                        returnValue.push(
                            factory.createExpressionStatement(nodeToken([
                                elementAccessExpression(["exports", variableDefinition]),
                                factory.createIdentifier(variableDefinition)
                            ]))
                        )
                    }
                }
            }
            return returnValue
        case ts.SyntaxKind.ExportAssignment:
            // delete node.parent
            return [factory.createExpressionStatement(nodeToken([
                elementAccessExpression(["exports", "default"]),
                factory.cloneNode(node.expression)
            ]))]
        case ts.SyntaxKind.ExportDeclaration:
            for (const exportDeclarations of node.exportClause.elements) {
                const declarationNamesObject = getVariableDeclarationNames(exportDeclarations)
                for (const declarationName in declarationNamesObject) {
                    returnValue.push(
                        factory.createExpressionStatement(nodeToken([
                            elementAccessExpression(["exports", declarationName]),
                            factory.cloneNode(getVariableDeclarationNode(declarationNamesObject[declarationName]))
                        ]))
                    )

                }
            }
            return returnValue
        default:
            return returnValue
    }


}
const ifHaveExportModifier = (node, modifierKind = ts.SyntaxKind.ExportKeyword) => {
    for (const { kind } of (node.modifiers || [])) {
        if (kind === modifierKind) {
            return true
        }
    }
    return false
}
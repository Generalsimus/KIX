import ts from "typescript";
import { App } from "../../app";
import { factoryCode } from "../factoryCode";
import { elementAccessExpression } from "../factoryCode/ElementAccessExpression";
import { variableStatement } from "../factoryCode/VariableStatement";
const factory = ts.factory;

export const ImportDeclaration = (node, visitor, context) => {
    // console.log("🚀 --> file: module.ts --> line 13 --> node", node);

    const importedModuleInfo = context.currentModuleInfo.moduleCollection[node.moduleSpecifier.text];
    var namespaceDeclaration = ts.getNamespaceDeclarationNode(node);
    if (!importedModuleInfo) {
        return ts.visitEachChild(node, visitor, context);
    }
    var namespaceDeclaration = ts.getNamespaceDeclarationNode(node);
    // CREATE_Const_Variable
    if (!node.importClause) {
        // import "mod";   
        return elementAccessExpression([App.windowModuleLocationName, importedModuleInfo.moduleIndex])
    } else {
        const variablesNameValueNodes = []
        if (namespaceDeclaration && !ts.isDefaultImport(node)) {
            // import * as n from "mod";
            variablesNameValueNodes.push([
                factory.cloneNode(namespaceDeclaration.name),
                elementAccessExpression([App.windowModuleLocationName, importedModuleInfo.moduleIndex])
            ])
        } else {
            // import d from "mod";
            // import { x, y } from "mod";
            // import d, { x, y } from "mod";
            // import d, * as n from "mod"; 
            try {
                moduleVisitor(node.importClause)
            } catch { }

        }
        if (variablesNameValueNodes.length) {
            return variableStatement(variablesNameValueNodes)
        }
    }
    return ts.visitEachChild(node, visitor, context)
}









const moduleVisitor = (childNode) => {
    switch (childNode.kind) {
        case ts.SyntaxKind.NamespaceImport:
            return variablesNameValueNodes.push([
                factory.cloneNode(childNode.name),
                elementAccessExpression([App.windowModuleLocationName, importedModuleInfo.moduleIndex])
            ]);
        case ts.SyntaxKind.NamedImports:
            for (const importElement of childNode.elements) {
                variablesNameValueNodes.push([
                    factory.cloneNode(importElement.name),
                    elementAccessExpression([App.windowModuleLocationName, importedModuleInfo.moduleIndex, (importElement.propertyName || importElement.name).escapedText])
                ]);
            }
            return
        case ts.SyntaxKind.Identifier:
            variablesNameValueNodes.push([
                factory.cloneNode(childNode),
                elementAccessExpression([App.windowModuleLocationName, importedModuleInfo.moduleIndex, "default"])
            ]);
            return;
    }
    return ts.visitEachChild(childNode, moduleVisitor, context)
}
import ts from "typescript";
import { App } from "../../app";
import { factoryCode } from "../factoryCode";
import { elementAccessExpression } from "../factoryCode/elementAccessExpression";
import { variableStatement } from "../factoryCode/variableStatement";

export const ImportVisitor = (node, statements, context) => {
    const factory = ts.factory;
    const importsStatements = []
    const variablesNameValueNodes = []
    const currentModuleInfo = ts.collectExternalModuleInfo(context, node, context.getEmitResolver(), context.getCompilerOptions());
    for (const importNode of currentModuleInfo.externalImports) {
        const moduleInfo = context.currentModuleInfo.moduleCollection[importNode.moduleSpecifier?.text];
        const importedModuleInfo = moduleInfo?.jsResolvedModule || moduleInfo;
        if (!importedModuleInfo) continue;
        // delete importNode.parent;
        // console.log("🚀 --> file: --> importNode.moduleSpecifier?.text", importNode);
        // if (importNode.moduleSpecifier?.text.endsWith(".scss")) {
        //     delete importNode.parent;
        //     console.log("🚀 --> file: --> importNode.moduleSpecifier?.text", importNode);
        // }
        if (!importNode.importClause) {
            importsStatements.push(elementAccessExpression([App.uniqAccessKey, importedModuleInfo.moduleIndex]))
            continue;
        }
        // if (!importNode.importNode) {
        //     console.log("🚀 --> file: ImportVisitor.js --> line 19 --> ImportVisitor --> importNode", importNode);

        // }
        variablesNameValueNodes.push([
            ts.getLocalNameForExternalImport(factory, importNode, node),
            elementAccessExpression([App.uniqAccessKey, importedModuleInfo.moduleIndex])
        ])
    }

    if (variablesNameValueNodes.length) {
        importsStatements.push(variableStatement(variablesNameValueNodes))
    }
    return [...importsStatements, ...statements]
}










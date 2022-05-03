import ts from "typescript"
import { CustomContextType } from ".."
import { App } from "../../app"
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression"
import { variableStatement } from "../factoryCode/variableStatement"

export const ImportVisitor = (node: ts.Statement, context: CustomContextType) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const moduleInfo = context.currentModuleInfo.moduleCollection[node.moduleSpecifier.text];
        const importedModuleInfo = moduleInfo?.jsResolvedModule || moduleInfo;

        if (!importedModuleInfo) return node;
        const moduleIndexNode = context.factory.createNumericLiteral(importedModuleInfo.moduleIndex);
        if (!node.importClause) {

            return context.factory.createExpressionStatement(propertyAccessExpression([App.uniqAccessKey, moduleIndexNode]));
        }
        return variableStatement([
            [
                context.factory.getGeneratedNameForNode(node),
                propertyAccessExpression([App.uniqAccessKey, moduleIndexNode])
            ]
        ])

    }
    return node;
}
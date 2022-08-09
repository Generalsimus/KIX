import ts from "typescript";
import { CustomContextType } from "..";
import { App } from "../../app";
import { moduleBody } from "../factoryCode/moduleBody";
import { exportVisitor } from "./exportVisitor";
import { ImportVisitor } from "./ImportVisitor";
import { moduleBodyVisitor } from "./moduleBodyVisitor";

const VisitableFilesExtensionRegExp = /(\.(((j|t)sx)|js)|svg)$/i
export const visitSourceFileBefore = (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
    const moduleInfo = App.moduleThree.get(node.fileName)

    if (!moduleInfo) throw new Error(`Could not find module ${node.fileName}`)

    if (moduleInfo) {
        context.currentModuleInfo = moduleInfo
    }

    context.substituteNodesList = new Map();
    context.usedIdentifiers = new Map();


    const isJsxSupported = VisitableFilesExtensionRegExp.test(node.fileName);
    const needsToVisit = isJsxSupported && !moduleInfo.isNodeModule;

    let moduleBodyStatements = node.statements.flatMap((emitNode) => {
        const modifiedImportNode = ImportVisitor(emitNode, context);
        const modifiedExportNode = exportVisitor(modifiedImportNode, context);
        return modifiedExportNode;
    })

    if (needsToVisit) {
        moduleBodyStatements = moduleBodyVisitor(
            moduleBodyStatements,
            visitor,
            context
        )
    }
    const visitedSourceFile = context.factory.updateSourceFile(
        node,
        moduleBodyStatements
    )



    return visitedSourceFile;
}

export const visitSourceFilesAfter = (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
    const moduleInfo = App.moduleThree.get(node.fileName);
    const statements = [...node.statements];
    /* REMOVE __esModule = true */
    // TODO: __esModule = true მგონი ზედმეტია
    if (!moduleInfo) throw new Error(`Could not find module ${node.fileName}`)
    return context.factory.updateSourceFile(
        node, [
        moduleBody(moduleInfo, statements)
    ]);
}
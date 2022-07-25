import ts from "typescript";
import { CustomContextType } from "..";
import { App } from "../../app";
import { moduleBody } from "../factoryCode/moduleBody";
import { exportVisitor } from "./exportVisitor";
import { ImportVisitor } from "./ImportVisitor";

export const visitSourceFileBefore = (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
    const moduleInfo = App.moduleThree.get(node.fileName)

    if (!moduleInfo) throw new Error(`Could not find module ${node.fileName}`)

    if (moduleInfo) {
        context.currentModuleInfo = moduleInfo
    }

    context.substituteNodesList = new Map();
    context.usedIdentifiers = new Map();


    const isJsxSupported = /(\.((j|t)sx)|js)$/i.test(node.fileName);
    const needsToVisit = isJsxSupported && !moduleInfo.isNodeModule;


    const visitedSourceFile = context.factory.updateSourceFile(
        node,
        node.statements.flatMap((emitNode) => {
            const modifiedImportNode = ImportVisitor(emitNode, context);
            const modifiedExportNode = exportVisitor(modifiedImportNode, context);

            if (needsToVisit) {
                return modifiedExportNode.flatMap((itemNode) => {
                    const visitedNode = visitor(itemNode);
                    if (visitedNode instanceof Array) {
                        return visitedNode
                    }
                    return [visitedNode]
                }) as ts.Statement[];
            }
            return modifiedExportNode;
        })
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
        node,
        [
            moduleBody(moduleInfo, statements)
        ]
    );
}
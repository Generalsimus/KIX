import ts from "typescript";
import { CustomContextType } from "..";
import { App } from "../../app";
import { moduleBody } from "../factoryCode/moduleBody";
import { exportVisitor } from "./exportVisitor";
import { ImportVisitor } from "./ImportVisitor";
import { moduleSourceFileBodyVisitor } from "./moduleSourceFileBodyVisitor";
// import { transformJsx } from "./transformJsx";

const VisitableFilesExtensionRegExp = /(\.(((j|t)sx)|js)|svg)$/i
export const visitSourceFileBefore = (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
    const moduleInfo = App.moduleThree.get(node.fileName)

    if (!moduleInfo) throw new Error(`Could not find module ${node.fileName}`)

    if (moduleInfo) {
        context.currentModuleInfo = moduleInfo
    }



    const isJsxSupported = VisitableFilesExtensionRegExp.test(node.fileName);
    const needsToVisit = isJsxSupported && !moduleInfo.isNodeModule;


    if (needsToVisit) {
        const substituteNodesList = context.substituteNodesList = new Map();
        context.addDeclaredIdentifierState = () => { }
        context.addIdentifiersChannelCallback = () => { }

        node = moduleSourceFileBodyVisitor(node, visitor, context);
        if (substituteNodesList.size) {
            const replaceNodesVisitor = (node: ts.Node) => {
                return (substituteNodesList.get(node) || ts.visitEachChild)?.(node, replaceNodesVisitor, context);
            }
            node = ts.visitEachChild(node, replaceNodesVisitor, context);
            substituteNodesList.clear();
        }

    }
    let moduleBodyStatements = node.statements.flatMap((emitNode) => {
        const modifiedImportNode = ImportVisitor(emitNode, context);
        const modifiedExportNode = exportVisitor(modifiedImportNode, context);
        return modifiedExportNode;
    })



    return context.factory.updateSourceFile(
        node,
        moduleBodyStatements
    )
}

export const visitSourceFilesAfter = (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
    const moduleInfo = App.moduleThree.get(node.fileName);

    /* REMOVE __esModule = true */
    // TODO: __esModule = true მგონი ზედმეტია 
    if (!moduleInfo) throw new Error(`Could not find module ${node.fileName}`);

    return context.factory.updateSourceFile(
        node, [
        moduleBody(moduleInfo, [...node.statements])
    ]);
}
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


    // node.externalModuleIndicator
    // context.factory.createSourceFile
    // return context.factory.createSourceFile(
    //     node.statements.flatMap((stateNode) => {
    //         if (needsToVisit) {
    //             stateNode = visitor(stateNode) as ts.Statement
    //         }
    //         return exportVisitor(stateNode, context).flatMap((emitNode) => {
    //             let newNode: ts.Statement | ts.Statement[] | undefined = ImportVisitor(emitNode, context);

    //             return newNode ? (newNode instanceof Array ? newNode : [newNode]) : [];
    //         })
    //     }),
    //     node.endOfFileToken,
    //     node.flags
    // )
    const visitedSourceFile = context.factory.updateSourceFile(
        node,
        node.statements.flatMap((stateNode) => {
            if (needsToVisit) {
                stateNode = visitor(stateNode) as ts.Statement
            }
            return exportVisitor(stateNode, context).flatMap((emitNode) => {
                let newNode: ts.Statement | ts.Statement[] | undefined = ImportVisitor(emitNode, context);

                return newNode ? (newNode instanceof Array ? newNode : [newNode]) : [];
            })
        })
    )

    return visitedSourceFile;
}

export const visitSourceFilesAfter = (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
    const moduleInfo = App.moduleThree.get(node.fileName);
    const statements = [...node.statements];
    // remove __esModule = true
    statements.splice(1, 1);
    if (!moduleInfo) throw new Error(`Could not find module ${node.fileName}`)
    return context.factory.updateSourceFile(
        node,
        [
            moduleBody(moduleInfo, statements)
        ]
    );
}
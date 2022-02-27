import ts from "typescript";
import { CustomContextType } from "..";
import { App } from "../../app";
import { moduleBody } from "../factoryCode/moduleBody";
import { exportVisitor } from "../module/exportVisitor";

export const visitSourceFileBefore = (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
     
    const moduleInfo = App.moduleThree.get(node.fileName)
     
    // console.log("🚀 --> file: visitSourceFile.ts --> line 10 --> visitSourceFileBefore --> node.fileName", node.fileName);

    if (!moduleInfo) throw new Error(`Could not find module ${node.fileName}`)

    if (moduleInfo) {
        context.currentModuleInfo = moduleInfo
    }

    const statements: ts.Statement[] = [
        moduleBody(
            moduleInfo,
            node.statements.flatMap((stateNode) => {
                return exportVisitor(stateNode).flatMap((childNode) => {
                    childNode = visitor(childNode)
                    return childNode ? [childNode] : []
                })
            })
        )
    ]

    return context.factory.updateSourceFile(node, statements)
}

export const visitSourceFilesAfter = (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {

    const returnNode = context.factory.updateSourceFile(node, node.statements.filter((stateNode) => {
        return ts.SyntaxKind.ExportDeclaration !== stateNode.kind
    }))

    return returnNode
}
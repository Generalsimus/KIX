import ts from "typescript";
import { CustomContextType } from "..";
import { App } from "../../app";
import { moduleBody } from "../factoryCode/moduleBody";
import { useJsxRegistration } from "../jsx/useJsxRegistrator";
import { exportVisitor } from "../module/exportVisitor";

export const visitSourceFileBefore = (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
    const moduleInfo = App.moduleThree.get(node.fileName)

    if (!moduleInfo) throw new Error(`Could not find module ${node.fileName}`)

    if (moduleInfo) {
        context.currentModuleInfo = moduleInfo
    }
    const catchNewState = useJsxRegistration(context)

    const statements: ts.Statement[] = [
        moduleBody(
            moduleInfo,
            node.statements.flatMap((stateNode) => exportVisitor(stateNode))
        )
    ]
    catchNewState(statements)

    const returnNode = context.factory.updateSourceFile(node, statements)





    return ts.visitEachChild(returnNode, visitor, context)
}

export const visitSourceFilesAfter = (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {

    const returnNode = context.factory.updateSourceFile(node, node.statements.filter((stateNode) => {
        return ts.SyntaxKind.ExportDeclaration !== stateNode.kind
    }))

    return returnNode
}
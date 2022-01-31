// TransformersObjectType

import ts, { factory, Statement } from "typescript";
import { App } from "../../app";
import { CustomContextType, TransformersObjectType } from "../";
import { ImportDeclaration } from "./ImportDeclaration";
import { ExportAssignment } from "./ExportAssignment";
import { ExportKeyword } from "./ExportKeyword";
import { exportVisitor } from "./exportVisitor";
import { arrowFunction } from "../factoryCode/arrowFunction";
import { moduleBody } from "../factoryCode/moduleBody";


export const moduleTransformerBefore = {
    [ts.SyntaxKind.ImportDeclaration]: ImportDeclaration,
    [ts.SyntaxKind.ExportAssignment]: ExportAssignment,
    [ts.SyntaxKind.ExportKeyword]: () => { },
    [ts.SyntaxKind.DefaultKeyword]: () => { },
    [ts.SyntaxKind.ExportDeclaration]: () => { },

    [ts.SyntaxKind.SourceFile]: (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
        // return node;
        const moduleInfo = App.moduleThree.get(node.fileName)

        if (!moduleInfo) throw new Error(`Could not find module ${node.fileName}`)

        if (moduleInfo) {
            context.currentModuleInfo = moduleInfo
        }




        const statements: ts.Statement[] = [
            ...node.statements,
            moduleBody(
                moduleInfo,
                node.statements.flatMap((stateNode) => exportVisitor(stateNode).flatMap((stateNode) => {
                    stateNode = visitor(stateNode)
                    return stateNode ? [stateNode] : []
                }))
            )
        ]


        const returnNode = context.factory.updateSourceFile(node, statements)

        return returnNode
    },

}


export const moduleTransformerAfter = {
    [ts.SyntaxKind.SourceFile]: (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {

        const returnNode = context.factory.updateSourceFile(node, node.statements.filter((stateNode) => {
            return stateNode.pos < 0
        }))

        return returnNode
    }
}
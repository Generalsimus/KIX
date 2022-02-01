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
import { unicssssss } from "../../app/createProgram";


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
            moduleBody(
                moduleInfo,
                node.statements.flatMap((stateNode) => exportVisitor(stateNode))
            )
        ]


        const returnNode = context.factory.updateSourceFile(node, statements)

        return ts.visitEachChild(returnNode, visitor, context)
    },

}


export const moduleTransformerAfter = {
    [ts.SyntaxKind.SourceFile]: (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {

        const returnNode = context.factory.updateSourceFile(node, node.statements.filter((stateNode) => {
            return ts.SyntaxKind.ExportDeclaration !== stateNode.kind
        }))

        return returnNode
    }
}
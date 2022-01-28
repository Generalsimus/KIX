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


export const moduleTransformer = {
    [ts.SyntaxKind.ImportDeclaration]: ImportDeclaration,
    // [ts.SyntaxKind.ExportAssignment]: ExportAssignment,
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
        // return node
        // context.moduleInfo = moduleInfo
        // console.log("🚀 --> file: module.ts --> line 23 --> moduleInfo", moduleInfo);
        // console.log("🚀 --> file: module.ts --> line 23 --> node.fileName", node.fileName);
        // console.log("🚀 --> file: module.ts --> line 23 --> node.fileName", App.moduleThree.keys());
        // importModulesAccessKey
        // if (ts.SyntaxKind.SourceFile === node.kind) {
        //     // node.s
        //     return node;
        // ImportDeclaration

        // }
        // node.statements = []
        // ts.updateSourceFile([])
        // const returnNode = ts.visitEachChild(node, visitor, context);
        // returnNode.statements = [] as ts.Node[]
        // ts.Statement[]
        // ts.VariableDeclarationList
        const statements: ts.Statement[] = [moduleBody(
            moduleInfo,
            node.statements.flatMap((stateNode) => exportVisitor(stateNode))
        )]
        // [factory.createExpressionStatement(arrowFunction(
        //     [
        //         "EXPORT_MODULE_NAME",
        //     ],

        //     node.statements.flatMap((stateNode) => exportVisitor(stateNode))
        //     // .flatMap((stateNode) => [stateNode, factory.createEmptyStatement()])
        // ))]
        //  
        // ts.VariableStatement
        // factory.createExpressionStatement(
        const returnNode = context.factory.updateSourceFile(node, statements, true)

        // (returnNode as any)["externalModuleIndicator"] = undefined;
        // return returnNode
        return ts.visitEachChild(returnNode, visitor, context);
    },

}  
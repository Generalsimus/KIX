// TransformersObjectType

import ts, { factory } from "typescript";
import { App } from "../../app";
import { CustomContextType, TransformersObjectType } from "../";
import { ImportDeclaration } from "./ImportDeclaration";


export const moduleTransformer = {
    [ts.SyntaxKind.ImportDeclaration]: ImportDeclaration,

    [ts.SyntaxKind.SourceFile]: (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
        const moduleInfo = App.moduleThree.get(node.fileName)
        if (moduleInfo) {
            context.currentModuleInfo = moduleInfo
        }
        // context.moduleInfo = moduleInfo
        // console.log("🚀 --> file: module.ts --> line 23 --> moduleInfo", moduleInfo);
        console.log("🚀 --> file: module.ts --> line 23 --> node.fileName", node.fileName);
        // console.log("🚀 --> file: module.ts --> line 23 --> node.fileName", App.moduleThree.keys());
        // importModulesAccessKey
        // if (ts.SyntaxKind.SourceFile === node.kind) {
        //     // node.s
        //     return node;
        // ImportDeclaration

        // }
        // node.statements = []
        // ts.updateSourceFile([])
        return ts.visitEachChild(node, visitor, context)
    },

}
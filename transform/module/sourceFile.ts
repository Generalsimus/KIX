import ts from "typescript";
import { CustomContextType } from "..";
import { App } from "../../app";
import { moduleBody } from "../factoryCode/moduleBody";
import { exportVisitor } from "./exportVisitor";
import { ImportVisitor } from "./ImportVisitor";
// import { nodeToExportJson } from "./utils/nodeToExportJson";

export const visitSourceFileBefore = (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {

    const moduleInfo = App.moduleThree.get(node.fileName)

    if (!moduleInfo) throw new Error(`Could not find module ${node.fileName}`)

    if (moduleInfo) {
        context.currentModuleInfo = moduleInfo
    }
    // let declarationStateNamesIdentifier: ts.Identifier | undefined
    // context.getVariableDeclarationStateNameIdentifier = () => (declarationStateNamesIdentifier || (declarationStateNamesIdentifier = context.factory.createUniqueName("_S")))
    // context.variableIdentifiersNameStatement = new Map();
    // context.substituteNodesData = new Map();
    context.substituteNodesList = new Map();
    context.usedIdentifiers = new Map();
    // context.replaceBlockNodes = new Map();



    let moduleBodyNode = moduleBody(
        moduleInfo,
        node.statements.flatMap((stateNode) => {
           

            return exportVisitor(stateNode, context).flatMap((emitNode) => {
                let newNode: ts.Statement | ts.Statement[] | undefined = ImportVisitor(emitNode, context);

                // return [ts.createIdentifier("")]
                return newNode ? (newNode instanceof Array ? newNode : [newNode]) : [];
            })
        }),
        context
    );


    const isJsxSupported = /(\.((j|t)sx)|js)$/i.test(node.fileName);

    if (isJsxSupported && !moduleInfo.isNodeModule) {
        moduleBodyNode = visitor(moduleBodyNode) as ts.ExpressionStatement
        // console.log("🚀 --> file: sourceFile.ts --> line 54 --> visitSourceFileBefore --> n", node.);
    }


    const visitedSourceFile = context.factory.updateSourceFile(node, [moduleBodyNode])


    return visitedSourceFile;
}

export const visitSourceFilesAfter = (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
    // return node
    const returnNode = context.factory.updateSourceFile(node, node.statements.filter((stateNode) => {
        if (
            ts.isExpressionStatement(stateNode) &&
            ts.isCallExpression(stateNode.expression) &&
            ts.isIdentifier(stateNode.expression.expression) &&
            ts.idText(stateNode.expression.expression) === (App.uniqAccessKey + "_MODULE")
        ) {
            return true
        }
    })

        // node.isDeclarationFile,
        // node.referencedFiles,
        // node.typeReferenceDirectives,
        // node.hasNoDefaultLib,
        // node.libReferenceDirectives
    )

    return returnNode
}

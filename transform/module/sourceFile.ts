import ts from "typescript";
import { CustomContextType } from "..";
import { App } from "../../app";
import { moduleBody } from "../factoryCode/moduleBody";
import { exportVisitor } from "./exportVisitor";
import { ImportVisitor } from "./ImportVisitor";

export const visitSourceFileBefore = (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
    // return node
    const moduleInfo = App.moduleThree.get(node.fileName)

    if (!moduleInfo) throw new Error(`Could not find module ${node.fileName}`)

    if (moduleInfo) {
        context.currentModuleInfo = moduleInfo
    }
    let declarationStateNamesIdentifier: ts.Identifier | undefined
    context.getVariableDeclarationStateNameIdentifier = () => (declarationStateNamesIdentifier || (declarationStateNamesIdentifier = context.factory.createUniqueName("_S")))
    context.getVariableDeclarationNames = () => ({})
    context.variableDeclarationStatement = {
        var: {},
        const: {},
        let: {},
    }

    const statements = [
        moduleBody(
            moduleInfo,
            node.statements.flatMap((stateNode) => {
                return exportVisitor(stateNode, context).flatMap((emitNode) => {
                    let newNode: ts.Statement | ts.Statement[] | undefined = ImportVisitor(emitNode, context)
                    if (node.languageVariant === ts.LanguageVariant.JSX) {
                        newNode = visitor(newNode) as any
                    }

                    return newNode ? (newNode instanceof Array ? newNode : [newNode]) : [];
                })
            }),
            context
        )
    ]

    return context.factory.updateSourceFile(node, statements)
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
    }))

    return returnNode
}
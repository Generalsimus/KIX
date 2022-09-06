import ts from "typescript"
import { CustomContextType } from ".."
import { createObject } from "../factoryCode/createObject"
import { variableStatement } from "../factoryCode/variableStatement"
import { newBlockVisitor, VariableStateType } from "../jsx/utils/createBlockVisitor"
import { creteManageIdentifierState } from "../jsx/utils/getIdentifierState"

const moduleBodyNodesVisitor = newBlockVisitor(<N extends ts.SourceFile>(sourceFileNode: N, visitor: ts.Visitor, context: CustomContextType) => {

    return ts.visitEachChild(sourceFileNode, visitor, context);
}, true);

export const moduleSourceFileBodyVisitor = (
    sourceFileNode: ts.SourceFile,
    visitor: ts.Visitor,
    context: CustomContextType,
): ts.SourceFile => {

    const [visitedNode, variableState] = moduleBodyNodesVisitor(sourceFileNode, visitor, context)


    if (variableState.globalScopeIdentifiers) {
        const declarationNode = variableStatement([
            [variableState.globalScopeIdentifiers, createObject([])]
        ])
        return context.factory.updateSourceFile(
            visitedNode,
            [
                declarationNode,
                ...visitedNode.statements
            ],
            visitedNode.isDeclarationFile,
            visitedNode.referencedFiles,
            visitedNode.typeReferenceDirectives,
            visitedNode.hasNoDefaultLib,
            visitedNode.libReferenceDirectives,
        )
        // return [declarationNode, ...visitedNode]
    }
    return visitedNode
} 
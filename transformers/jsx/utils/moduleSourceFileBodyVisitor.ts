import ts from "typescript"
import { CustomContextType } from "../.."
import { createObject } from "../../factoryCode/createObject";
import { variableStatement } from "../../factoryCode/variableStatement";
import { createBlockVisitor } from "./createBlockVisitor";
// import { createObject } from "../factoryCode/createObject"
// import { variableStatement } from "../factoryCode/variableStatement"
// import { createBlockVisitor, VariableStateType } from "../jsx/utils/createBlockVisitor"
// import { creteManageIdentifierState } from "../jsx/utils/getIdentifierState"

const moduleBodyNodesVisitor = createBlockVisitor(<N extends ts.SourceFile>(sourceFileNode: N, visitor: ts.Visitor, context: CustomContextType) => {

    return ts.visitEachChild(sourceFileNode, visitor, context);
}, true);

export const moduleSourceFileBodyVisitor = (
    sourceFileNode: ts.SourceFile,
    visitor: ts.Visitor,
    context: CustomContextType,
): ts.SourceFile => {

    let [visitedStatements, variableState] = moduleBodyNodesVisitor(sourceFileNode, visitor, context)


    if (variableState.globalScopeIdentifiers) {
        const declarationNode = variableStatement([
            [variableState.globalScopeIdentifiers, createObject([])]
        ])

        return context.factory.updateSourceFile(
            sourceFileNode,
            [
                declarationNode,
                ...visitedStatements.statements
            ],
            sourceFileNode.isDeclarationFile,
            sourceFileNode.referencedFiles,
            sourceFileNode.typeReferenceDirectives,
            sourceFileNode.hasNoDefaultLib,
            sourceFileNode.libReferenceDirectives,
        )

    }



    return visitedStatements
} 
import ts from "typescript";
import { CustomContextType } from "..";
import { createObject } from "../factoryCode/createObject";
import { variableStatement } from "../factoryCode/variableStatement";
import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";

export const ClassStaticBlockDeclaration = () => createBlockVisitor((
    node: ts.ClassStaticBlockDeclaration,
    visitor: ts.Visitor,
    context: CustomContextType,
    variableState: VariableStateType
) => {
    const visitedNode = ts.visitEachChild(node, visitor, context)
    if (variableState.blockScopeIdentifiers) {
        return context.factory.updateClassStaticBlockDeclaration(
            visitedNode,
            visitedNode.decorators,
            visitedNode.modifiers,
            context.factory.updateBlock(
                visitedNode.body,
                [
                    variableStatement([
                        [variableState.blockScopeIdentifiers, createObject([])]
                    ]),
                    ...visitedNode.body.statements
                ]
            ),
        )
    }
    return visitedNode
})
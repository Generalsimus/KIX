import ts from "typescript";
import { createBlockVisitor } from "./utils/createBlockVisitor";
import { createGlobalBlockNodesVisitor } from "./utils/createGlobalBlockNodesVisitor";



export const FunctionExpression = createGlobalBlockNodesVisitor(
    (visitedNode: ts.FunctionExpression, declarationNode, context) => {
        return context.factory.updateFunctionExpression(
            visitedNode,
            visitedNode.modifiers,
            visitedNode.asteriskToken,
            visitedNode.name,
            visitedNode.typeParameters,
            visitedNode.parameters,
            visitedNode.type,
            context.factory.updateBlock(
                visitedNode.body,
                [
                    declarationNode,
                    ...visitedNode.body.statements
                ]
            ),

        )
    }
)

import ts from "typescript";
import { createGlobalBlockNodesVisitor } from "./utils/createGlobalBlockNodesVisitor";


export const MethodDeclaration = createGlobalBlockNodesVisitor(
    (visitedNode: ts.MethodDeclaration, declarationNode, context) => {
        
        return context.factory.updateMethodDeclaration(
            visitedNode,
            visitedNode.decorators,
            visitedNode.modifiers,
            visitedNode.asteriskToken,
            visitedNode.name,
            visitedNode.questionToken,
            visitedNode.typeParameters,
            visitedNode.parameters,
            visitedNode.type,
            visitedNode.body && context.factory.updateBlock(
                visitedNode.body,
                [
                    declarationNode,
                    ...visitedNode.body.statements
                ]
            ), 
        );
    }
)

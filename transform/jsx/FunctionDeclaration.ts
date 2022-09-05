import ts from "typescript";
import { CustomContextType } from "..";
import { identifier } from "../factoryCode/identifier";
import { nodeToken } from "../factoryCode/nodeToken";
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression";
import { createGlobalBlockNodesVisitor } from "./utils/createGlobalBlockNodesVisitor";
// import { getIdentifierState } from "./utils/getIdentifierState";


const FunctionDeclarationVisitor = createGlobalBlockNodesVisitor(
    (visitedNode: ts.FunctionDeclaration, declarationNode, context) => {
        return context.factory.updateFunctionDeclaration(
            visitedNode,
            ts.getModifiers(visitedNode),
            visitedNode.asteriskToken,
            visitedNode.name,
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
        )
    }
)

export const FunctionDeclaration = (node: ts.FunctionDeclaration, visitor: ts.Visitor, context: CustomContextType) => {
    const returnValue: ts.Node[] = [
        FunctionDeclarationVisitor(node, visitor, context)
    ]
    if (node.name) {
        const declarationIdentifierName = ts.idText(node.name)

        context.addIdentifiersChannelCallback(declarationIdentifierName, (identifierState) => {
            identifierState.declaredFlag = ts.NodeFlags.None;
            const declarationMarker = context.factory.createIdentifier("");
            returnValue.push(declarationMarker);
            const { substituteCallback } = identifierState
            identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
                context.substituteNodesList.set(declarationMarker, () => {

                    return context.factory.createExpressionStatement(nodeToken([
                        propertyAccessExpression(
                            [
                                declarationIdentifier,
                                indexIdToUniqueString
                            ],
                            "createPropertyAccessExpression"
                        ),
                        identifier(declarationIdentifierName)
                    ]));
                });

                substituteCallback(indexIdToUniqueString, declarationIdentifier)
            }
        });

    }

    // returnValue.push();
    return returnValue
}
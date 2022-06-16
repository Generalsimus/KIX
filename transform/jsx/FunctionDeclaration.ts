import ts from "typescript";
import { CustomContextType } from "..";
import { NumberToUniqueString } from "../../utils/numberToUniqueString";
import { identifier } from "../factoryCode/identifier";
import { nodeToken } from "../factoryCode/nodeToken";
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression";
import { createBlockVisitor } from "./utils/createBlockVisitor";
import { createGlobalBlockNodesVisitor } from "./utils/createGlobalBlockNodesVisitor";
import { getIdentifierState } from "./utils/getIdentifierState";


const FunctionDeclarationVisitor = createGlobalBlockNodesVisitor(
    (visitedNode: ts.FunctionDeclaration, declarationNode, context) => {
        return context.factory.updateFunctionDeclaration(
            visitedNode,
            visitedNode.decorators,
            visitedNode.modifiers,
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
        const identifierState = getIdentifierState(declarationIdentifierName, context);
        identifierState.declaredFlag = ts.NodeFlags.None;
        const declarationMarker = context.factory.createIdentifier("Marker");
        returnValue.push(declarationMarker);
        const { substituteCallback } = identifierState
        identifierState.substituteCallback = (indexId: number, declarationIdentifier: ts.Identifier) => {
            context.substituteNodesList.set(declarationMarker, () => {

                return context.factory.createExpressionStatement(nodeToken([
                    propertyAccessExpression(
                        [
                            declarationIdentifier,
                            NumberToUniqueString(indexId)
                        ],
                        "createPropertyAccessExpression"
                    ),
                    identifier(declarationIdentifierName)
                ]));
            });

            substituteCallback(indexId, declarationIdentifier)
        }
    }

    // returnValue.push();
    return returnValue
}
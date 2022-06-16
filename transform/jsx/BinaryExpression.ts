import ts from "typescript";
import { CustomContextType } from "..";
import { nodeToken } from "../factoryCode/nodeToken";
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression";
import { getKeyAccessIdentifierName } from "./Identifier";
import { getIdentifierState } from "./utils/getIdentifierState";
// import { updateSubstitutions } from "./utils/updateSubstitutions";

export const BinaryExpression = (node: ts.BinaryExpression, visitor: ts.Visitor, context: CustomContextType) => {
    const visitedNode = ts.visitEachChild(node, visitor, context);
    if (ts.isIdentifier(visitedNode.left)) {

        const identifierName = ts.idText(visitedNode.left);
        const identifierState = getIdentifierState(identifierName, context);

        identifierState.isChanged = true;
        const { substituteCallback } = identifierState
        identifierState.substituteCallback = (indexId: number, declarationIdentifier: ts.Identifier) => {

            context.substituteNodesList.set(visitedNode, () => {

                return nodeToken(
                    [
                        propertyAccessExpression(
                            [
                                declarationIdentifier,
                                getKeyAccessIdentifierName(indexId, identifierName)
                            ],
                            "createPropertyAccessExpression"
                        ),
                        context.factory.createParenthesizedExpression(
                            context.factory.createBinaryExpression(
                                visitedNode.left,
                                visitedNode.operatorToken,
                                visitedNode.right,
                            )
                        )
                    ]
                );
            });
            substituteCallback(indexId, declarationIdentifier);
        }


    }

    return visitedNode
}


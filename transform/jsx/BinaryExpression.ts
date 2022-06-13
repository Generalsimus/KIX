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
        identifierState.substituteIdentifiers.set(visitedNode, () => {

            return nodeToken(
                [
                    propertyAccessExpression(
                        [
                            identifierState.getBlockVariableStateUniqueIdentifier!(),
                            getKeyAccessIdentifierName(identifierState.indexId, identifierName)
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


    }

    return visitedNode
}


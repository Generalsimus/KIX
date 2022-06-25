import ts, { visitEachChild } from "typescript";
import { CustomContextType } from "../..";
import { nodeToken } from "../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../factoryCode/propertyAccessExpression";
// import { getKeyAccessIdentifierName } from "../Identifier";
import { getIdentifierState } from "./getIdentifierState";
// import { updateSubstitutions } from "./updateSubstitutions";

export const PostfixPostfixUnaryExpression = (node: ts.PrefixUnaryExpression | ts.PostfixUnaryExpression, visitor: ts.Visitor, context: CustomContextType) => {

    const visitedNode = visitEachChild(node, visitor, context);

    if (ts.isIdentifier(visitedNode.operand)) {
        const identifierName = ts.idText(visitedNode.operand);
        const identifierState = getIdentifierState(identifierName, context);


        identifierState.isChanged = true;
        context.enableSubstitution(visitedNode.kind);
        // const { getBlockVariableStateUniqueIdentifier } = context
        const { substituteCallback } = identifierState
        identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
            context.substituteNodesList.set(visitedNode, () => {
                let operandNode: undefined | ts.PrefixUnaryExpression | ts.PostfixUnaryExpression

                if (ts.isPrefixUnaryExpression(visitedNode)) {
                    operandNode = context.factory.createPrefixUnaryExpression(
                        visitedNode.operator,
                        visitedNode.operand,
                    );
                } else {
                    operandNode = context.factory.createPostfixUnaryExpression(
                        visitedNode.operand,
                        visitedNode.operator,
                    );
                }

                return nodeToken(
                    [
                        propertyAccessExpression(
                            [
                                declarationIdentifier,
                                indexIdToUniqueString
                            ],
                            "createPropertyAccessExpression"
                        ),
                        context.factory.createParenthesizedExpression(operandNode)
                    ]
                );

            });
            substituteCallback(indexIdToUniqueString, declarationIdentifier);
        }




    }


    return visitedNode
}
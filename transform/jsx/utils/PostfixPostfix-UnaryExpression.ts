import ts from "typescript";
import { CustomContextType } from "../..";
import { nodeToken } from "../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../factoryCode/propertyAccessExpression";
import { getIdentifierState } from "./getIdentifierState";


const changeValueNodeTokens = [
    ts.SyntaxKind.PlusPlusToken,
    ts.SyntaxKind.MinusMinusToken
]
export const PostfixPrefixUnaryExpression = (node: ts.PrefixUnaryExpression | ts.PostfixUnaryExpression, visitor: ts.Visitor, context: CustomContextType) => {


    const visitedNode = ts.visitEachChild(node, visitor, context);

    if (ts.isIdentifier(visitedNode.operand) && changeValueNodeTokens.includes(node.operator)) {
        const identifierName = ts.idText(visitedNode.operand);
        const identifierState = getIdentifierState(identifierName, context);


        identifierState.isChanged = true;
        context.enableSubstitution(visitedNode.kind);
        // const { getBlockVariableStateUniqueIdentifier } = context
        const { substituteCallback } = identifierState
        identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
            context.substituteNodesList.set(visitedNode, () => {
                context.substituteNodesList.delete(visitedNode);
                // let operandNode: undefined | ts.PrefixUnaryExpression | ts.PostfixUnaryExpression
                const propertyDeclarationNode = propertyAccessExpression(
                    [
                        declarationIdentifier,
                        indexIdToUniqueString
                    ],
                    "createPropertyAccessExpression"
                );
                if (ts.isPrefixUnaryExpression(visitedNode)) {
                    return nodeToken(
                        [
                            context.factory.updatePrefixUnaryExpression(
                                visitedNode,
                                propertyDeclarationNode
                            ),
                            context.factory.createParenthesizedExpression(visitedNode)
                        ],
                        ts.SyntaxKind.CommaToken
                    );
                } else {

                    return nodeToken(
                        [
                            context.factory.updatePostfixUnaryExpression(
                                visitedNode,
                                propertyDeclarationNode
                            ),
                            context.factory.createParenthesizedExpression(visitedNode)
                        ],
                        ts.SyntaxKind.CommaToken
                    );
                }

            });
            substituteCallback(indexIdToUniqueString, declarationIdentifier);
        }




    }


    return visitedNode
}
import ts from "typescript";
import { CustomContextType } from "..";
import { nodeToken } from "../factoryCode/nodeToken";
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression";


export const ValueChangeNodeTokens = [
    ts.SyntaxKind.PlusPlusToken,
    ts.SyntaxKind.MinusMinusToken
]

export const PostfixUnaryExpression = (node: ts.PostfixUnaryExpression, visitor: ts.Visitor, context: CustomContextType) => {

    const visitedNode = ts.visitEachChild(node, visitor, context);
    if (ts.isIdentifier(visitedNode.operand) && ValueChangeNodeTokens.includes(node.operator)) {

        const identifierName = ts.idText(visitedNode.operand);

        context.addIdentifiersChannelCallback(identifierName, (identifierState) => {
            identifierState.isChanged = true;
            identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
                context.substituteNodesList.set(visitedNode, () => {


                    return nodeToken([
                        context.factory.createParenthesizedExpression(
                            nodeToken(
                                [
                                    propertyAccessExpression(
                                        [
                                            declarationIdentifier,
                                            indexIdToUniqueString
                                        ],
                                        "createPropertyAccessExpression"
                                    ),
                                    context.factory.createPrefixUnaryExpression(
                                        visitedNode.operator,
                                        visitedNode.operand
                                    )
                                ],
                                ts.SyntaxKind.EqualsToken
                            )
                        ),
                        context.factory.createNumericLiteral("1")
                    ], ts.SyntaxKind.MinusToken)
                })
            }
        });
    }

    return visitedNode
}

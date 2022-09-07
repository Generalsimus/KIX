import ts from "typescript";
import { CustomContextType } from "..";
import { nodeToken } from "../factoryCode/nodeToken";
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression";
import { ValueChangeNodeTokens } from "./PostfixUnaryExpression";




export const PrefixUnaryExpression = (node: ts.PrefixUnaryExpression, visitor: ts.Visitor, context: CustomContextType) => {

    const visitedNode = ts.visitEachChild(node, visitor, context);
    if (ts.isIdentifier(visitedNode.operand) && ValueChangeNodeTokens.includes(node.operator)) {

        const identifierName = ts.idText(visitedNode.operand);

        context.addIdentifiersChannelCallback(identifierName, (identifierState) => {
            identifierState.isChanged = true;
            identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
                context.substituteNodesList.set(visitedNode, () => {
                    return nodeToken(
                        [
                            propertyAccessExpression(
                                [
                                    declarationIdentifier,
                                    indexIdToUniqueString
                                ],
                                "createPropertyAccessExpression"
                            ),
                            context.factory.updatePrefixUnaryExpression(
                                visitedNode,
                                visitedNode.operand
                            )
                        ],
                        ts.SyntaxKind.EqualsToken
                    )
                })
            }
        });
    }

}
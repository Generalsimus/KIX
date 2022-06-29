import ts from "typescript";
import { CustomContextType } from "..";
import { nodeToken } from "../factoryCode/nodeToken";
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression";
// import { getKeyAccessIdentifierName } from "./Identifier";
import { getIdentifierState } from "./utils/getIdentifierState";

const AssignmentTokensList = [
    ts.SyntaxKind.EqualsToken,
    ts.SyntaxKind.AsteriskEqualsToken,
    ts.SyntaxKind.AsteriskAsteriskEqualsToken,
    ts.SyntaxKind.SlashEqualsToken,
    ts.SyntaxKind.PercentEqualsToken,
    ts.SyntaxKind.PlusEqualsToken,
    ts.SyntaxKind.MinusEqualsToken,
    ts.SyntaxKind.LessThanLessThanEqualsToken,
    ts.SyntaxKind.GreaterThanGreaterThanEqualsToken,
    ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken,
    ts.SyntaxKind.AmpersandEqualsToken,
    ts.SyntaxKind.CaretEqualsToken,
    ts.SyntaxKind.BarEqualsToken,
    ts.SyntaxKind.AmpersandAmpersandEqualsToken,
    ts.SyntaxKind.BarBarEqualsToken,
    ts.SyntaxKind.QuestionQuestionEqualsToken,
]
export const BinaryExpression = (node: ts.BinaryExpression, visitor: ts.Visitor, context: CustomContextType) => {
    const visitedNode = ts.visitEachChild(node, visitor, context);
    if (ts.isIdentifier(visitedNode.left) && AssignmentTokensList.includes(visitedNode.operatorToken.kind)) {

        const identifierName = ts.idText(visitedNode.left);
        const identifierState = getIdentifierState(identifierName, context);

        identifierState.isChanged = true;
        const { substituteCallback } = identifierState
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
            substituteCallback(indexIdToUniqueString, declarationIdentifier);
        }


    }

    return visitedNode
}


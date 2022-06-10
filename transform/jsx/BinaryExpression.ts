import ts from "typescript";
import { PreCustomContextType } from ".";
import { CustomContextType, VariableDeclarationStatementItemType } from "..";
import { nodeToken } from "../factoryCode/nodeToken";
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression";
import { getKeyAccessIdentifierName } from "./Identifier";
import { getIdentifierState } from "./utils/getIdentifierState";
import { getVariableWithIdentifierKey } from "./utils/getVariableWithIdentifierKey";
// import { updateSubstitutions } from "./utils/updateSubstitutions";

export const BinaryExpression = (node: ts.BinaryExpression, visitor: ts.Visitor, context: PreCustomContextType) => {
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
                            context.getVariableDeclarationStateNameIdentifier(),
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


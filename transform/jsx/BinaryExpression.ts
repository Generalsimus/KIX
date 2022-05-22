import ts from "typescript";
import { CustomContextType, VariableDeclarationStatementItemType } from "..";
import { nodeToken } from "../factoryCode/nodeToken";
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression";
import { getKeyAccessIdentifierName } from "./Identifier";
import { getVariableWithIdentifierKey } from "./utils/getVariableWithIdentifierKey";
// import { updateSubstitutions } from "./utils/updateSubstitutions";

export const BinaryExpression = (node: ts.BinaryExpression, visitor: ts.Visitor, context: CustomContextType) => {
    const visitedNode = ts.visitEachChild(node, visitor, context);
    if (ts.isIdentifier(visitedNode.left)) {
        const identifierName = ts.idText(visitedNode.left);
        const identifiersState = getVariableWithIdentifierKey(identifierName, context);
        identifiersState.valueChanged = true;
        identifiersState.substituteIdentifiers.set(visitedNode, () => {

            return nodeToken(
                [
                    propertyAccessExpression(
                        [
                            context.getVariableDeclarationStateNameIdentifier(),
                            getKeyAccessIdentifierName(identifiersState.identifiersIndex, identifierName)
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
        // updateSubstitutions(identifierName, identifiersState, context);
    }

    return visitedNode
}


import ts, { visitEachChild } from "typescript";
import { PreCustomContextType } from "..";
import { CustomContextType } from "../..";
import { nodeToken } from "../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../factoryCode/propertyAccessExpression";
import { getKeyAccessIdentifierName } from "../Identifier";
import { addInBlockTransformerIfNeeded, getIdentifierState } from "./getIdentifierState";
import { getVariableWithIdentifierKey } from "./getVariableWithIdentifierKey";
import { getBlockNodeData } from "./getVariableWithIdentifierState/utils/getBlockNodeData";
// import { updateSubstitutions } from "./updateSubstitutions";

export const PostfixPostfixUnaryExpression = (node: ts.PrefixUnaryExpression | ts.PostfixUnaryExpression, visitor: ts.Visitor, context: PreCustomContextType) => {

    const visitedNode = visitEachChild(node, visitor, context);

    if (ts.isIdentifier(visitedNode.operand)) {
        const identifierName = ts.idText(visitedNode.operand);
        const identifierState = getIdentifierState(identifierName, context);



        identifierState.isChanged = true;
        identifierState.substituteIdentifiers.set(visitedNode, () => {
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
                            identifierState.declaration!.getBlockVariableStateUniqueIdentifier(),
                            getKeyAccessIdentifierName(identifierState.indexId, identifierName)
                        ],
                        "createPropertyAccessExpression"
                    ),
                    context.factory.createParenthesizedExpression(operandNode)
                ]
            );

        });
        // addInBlockTransformerIfNeeded(identifierState, context);


    }


    return visitedNode
}
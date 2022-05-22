import ts, { visitEachChild } from "typescript";
import { CustomContextType } from "../..";
import { nodeToken } from "../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../factoryCode/propertyAccessExpression";
import { getKeyAccessIdentifierName } from "../Identifier";
import { getVariableWithIdentifierKey } from "./getVariableWithIdentifierKey";
// import { updateSubstitutions } from "./updateSubstitutions";

export const PostfixPostfixUnaryExpression = (node: ts.PrefixUnaryExpression | ts.PostfixUnaryExpression, visitor: ts.Visitor, context: CustomContextType) => {

    const visitedNode = visitEachChild(node, visitor, context);

    if (ts.isIdentifier(visitedNode.operand)) {
        const identifierName = ts.idText(visitedNode.operand);


        const identifiersState = getVariableWithIdentifierKey(identifierName, context);
        identifiersState.valueChanged = true;
        // console.log("🚀 --> file: PostfixPostfix-UnaryExpression.ts --> visitedNode1", identifiersState.identifierName);
        context.enableSubstitution(visitedNode.kind)
        identifiersState.substituteIdentifiers.set(visitedNode, () => {
            

            let operandNode: undefined | ts.PrefixUnaryExpression | ts.PostfixUnaryExpression
            if (ts.isPrefixUnaryExpression(visitedNode)) {
                operandNode = context.factory.createPrefixUnaryExpression(
                    visitedNode.operator,
                    visitedNode.operand,
                )
            } else {
                operandNode = context.factory.createPostfixUnaryExpression(
                    visitedNode.operand,
                    visitedNode.operator,
                )
            }
            
            return nodeToken(
                [
                    propertyAccessExpression(
                        [
                            context.getVariableDeclarationStateNameIdentifier(),
                            getKeyAccessIdentifierName(identifiersState.identifiersIndex, identifierName)
                        ],
                        "createPropertyAccessExpression"
                    ),
                    context.factory.createParenthesizedExpression(operandNode)
                ]
            );
        });
        
        
    }

    
    return visitedNode
}
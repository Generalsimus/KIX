import ts from "typescript";
import { CustomContextType } from "..";

export const updateFunctionExpression = (
    functionExpressionNode: ts.FunctionExpression,
    substituteNodes: any,
    // substituteNodes: CustomContextType["substituteBlockNodes"],
    context: CustomContextType
) => {
    const statements: ts.Statement[] = [];


    for (const stateNode of functionExpressionNode.body.statements) {
        const replaceBlockNode = substituteNodes.get(stateNode as any);
        if (replaceBlockNode) {

            statements.push(...replaceBlockNode.replace() as any);
        } else {
            statements.push(stateNode)
        }
    }



    return context.factory.updateFunctionExpression(
        functionExpressionNode,
        functionExpressionNode.modifiers,
        functionExpressionNode.asteriskToken,
        functionExpressionNode.name,
        functionExpressionNode.typeParameters,
        functionExpressionNode.parameters,
        functionExpressionNode.type,
        context.factory.updateBlock(functionExpressionNode.body, statements)
    );

}
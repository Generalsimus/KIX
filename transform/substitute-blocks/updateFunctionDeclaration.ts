import ts from "typescript";
import { CustomContextType } from "..";

export const updateFunctionDeclaration = (
    functionDeclarationNode: ts.FunctionDeclaration,
    substituteNodes: any,
    // substituteNodes: CustomContextType["substituteBlockNodes"],
    context: CustomContextType
) => {


    const statements: ts.Statement[] = [];

    if (functionDeclarationNode.body) {

        for (const stateNode of functionDeclarationNode.body.statements) {
            const replaceBlockNode = substituteNodes.get(stateNode as any);
            if (replaceBlockNode) {

                statements.push(...replaceBlockNode.replace() as any);
            } else {
                statements.push(stateNode)
            }
        }

        return context.factory.updateFunctionDeclaration(
            functionDeclarationNode,
            functionDeclarationNode.decorators,
            functionDeclarationNode.modifiers,
            functionDeclarationNode.asteriskToken,
            functionDeclarationNode.name,
            functionDeclarationNode.typeParameters,
            functionDeclarationNode.parameters,
            functionDeclarationNode.type,
            context.factory.updateBlock(functionDeclarationNode.body, statements)
        );
    }


    return functionDeclarationNode;
}
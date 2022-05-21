import ts from "typescript";
import { CustomContextType } from "..";

export const updateMethodDeclaration = (
    methodDeclarationNode: ts.MethodDeclaration,
    substituteNodes: any,
    // substituteNodes: CustomContextType["substituteBlockNodes"],
    context: CustomContextType
) => {

    const statements: ts.Statement[] = [];

    if (methodDeclarationNode?.body) {

        for (const stateNode of methodDeclarationNode.body.statements) {
            const replaceBlockNode = substituteNodes.get(stateNode as any);
            if (replaceBlockNode) {

                statements.push(...replaceBlockNode.replace() as any);
            } else {
                statements.push(stateNode)
            }
        }


        return context.factory.updateMethodDeclaration(
            methodDeclarationNode,
            methodDeclarationNode.decorators,
            methodDeclarationNode.modifiers,
            methodDeclarationNode.asteriskToken,
            methodDeclarationNode.name,
            methodDeclarationNode.questionToken,
            methodDeclarationNode.typeParameters,
            methodDeclarationNode.parameters,
            methodDeclarationNode.type,
            context.factory.updateBlock(methodDeclarationNode.body, statements)
        );
    }


    return methodDeclarationNode;
}
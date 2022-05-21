import ts from "typescript";
import { CustomContextType } from "..";

export const updateArrowFunction = (
    arrowFunctionNode: ts.ArrowFunction,
    substituteNodes: any,
    // substituteNodes: CustomContextType["substituteBlockNodes"],
    context: CustomContextType
) => {

    const statements: ts.Statement[] = [];
    
    if (ts.isBlock(arrowFunctionNode.body)) {

        for (const stateNode of arrowFunctionNode.body.statements) {
            const replaceBlockNode = substituteNodes.get(stateNode as any);
            if (replaceBlockNode) {

                statements.push(...replaceBlockNode.replace() as any);
            } else {
                statements.push(stateNode)
            }
        }
        return context.factory.updateArrowFunction(
            arrowFunctionNode,
            arrowFunctionNode.modifiers,
            arrowFunctionNode.typeParameters,
            arrowFunctionNode.parameters,
            arrowFunctionNode.type,
            arrowFunctionNode.equalsGreaterThanToken,
            context.factory.updateBlock(arrowFunctionNode.body, statements)
        )
    }


    return arrowFunctionNode;
}
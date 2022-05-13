import ts from "typescript";
import { CustomContextType } from "..";

export const updateBlock = (
    blockNode: ts.Block,
    substituteNodes: CustomContextType["substituteBlockNodes"],
    context: CustomContextType
) => {
    const statements: ts.Statement[] = [];
    console.log("🚀 --> file: updateBlock.ts --> line 10 --> statements", statements);
    for (const stateNode of blockNode.statements) {
        const replaceBlockNode = substituteNodes.get(stateNode);
        if (replaceBlockNode) {

            statements.push(...replaceBlockNode() as any);
        } else {
            statements.push(stateNode)
        }
    }


    return context.factory.updateBlock(blockNode, statements);
}
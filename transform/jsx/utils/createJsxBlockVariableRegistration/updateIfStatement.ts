import ts from "typescript";
import { PreCustomContextType } from "../..";
import { CustomContextType } from "../../..";
import { updateBlockNode } from "./updateBlockNode";

export const updateIfStatement = (node: ts.IfStatement, context: PreCustomContextType) => {
    // const replaceBlockNodes = context.replaceBlockNodes;
    // console.log("🚀 --> file: updateIfStatement.ts --> line 7 --> updateIfStatement --> replaceBlockNodes", replaceBlockNodes.size);

    return context.factory.updateIfStatement(
        node,
        node.expression,
        updateBlockNode(node.thenStatement, context),
        node.elseStatement && updateBlockNode(node.elseStatement, context),
    )
}
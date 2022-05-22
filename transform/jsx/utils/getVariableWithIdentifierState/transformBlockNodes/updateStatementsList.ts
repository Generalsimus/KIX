import ts from "typescript";
import { transformNodes } from ".";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";

export const updateStatementsList = (
    statements: ts.NodeArray<ts.Statement> | (ts.Expression | ts.Statement)[],
    context: CustomContextType,
    substituteBlockData: ReturnType<typeof getBlockNodeData>
) => {
    const newStatements: (ts.Statement)[] = [];
    // transformNodes.
    for (const node of statements) {
        // newStatements.push(node as any);
        // continue;
        const newNode = (transformNodes as any)[node.kind]?.(node, context, substituteBlockData)
        if (newNode) {
            newStatements.push(...newNode);
        } else {
            newStatements.push(node as any);
        }
    }
    // node: ts.VariableStatement, context: CustomContextType, substituteBlockData
    return newStatements
}

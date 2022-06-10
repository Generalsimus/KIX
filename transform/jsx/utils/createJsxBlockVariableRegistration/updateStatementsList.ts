import ts from "typescript";
import { PreCustomContextType } from "../..";
import { createObject } from "../../../factoryCode/createObject";
import { variableStatement } from "../../../factoryCode/variableStatement";
import { transformNodeKind } from "./transform";


export const updateStatementsList = (
    statements: ts.NodeArray<ts.Statement> | (ts.Expression | ts.Statement)[],
    context: PreCustomContextType,
    newStatements: ts.Statement[] = []
) => {
    const { replaceBlockNodes, getBlockVariableStateUniqueIdentifier } = context;

    newStatements.push(
        variableStatement([
            [
                getBlockVariableStateUniqueIdentifier(),
                createObject([])
            ]
        ])
    );

    // transformNodes.
    for (const node of statements) {
        const replaceNodeData = replaceBlockNodes.get(node as any);
        if (replaceNodeData) {

            newStatements.push(...((transformNodeKind as any)[node.kind]?.(node, replaceNodeData, context) || [node]));
        } else {
            newStatements.push(node as any);
        }
    }
    // node: ts.VariableStatement, context: CustomContextType, substituteBlockData
    return newStatements
}

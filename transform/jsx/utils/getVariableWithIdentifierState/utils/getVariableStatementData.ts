import ts from "typescript";
import { CustomContextType } from "../../../..";

export const getVariableStatementData = (context: CustomContextType, node: ts.VariableStatement) => {
    let substituteBlockData = context.substituteNodesData.get(node)
    if (!substituteBlockData) {
        context.substituteNodesData.set(node, (substituteBlockData = {
            replaceDeclarations: new Map()
        }));
    }
    return substituteBlockData
}
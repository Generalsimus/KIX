import ts from "typescript";
import { CustomContextType, VariableDeclarationNodeType, variableDeclarationType } from "../../../..";

export const getParameterDeclarationData = (context: CustomContextType, node: ts.ParameterDeclaration) => {
    let substituteBlockData = context.substituteNodesData.get(node)
    if (!substituteBlockData) {
        context.substituteNodesData.set(node, (substituteBlockData = {
            addAfterParameterDeclaration: new Set()
        }));
    }
    return substituteBlockData
}
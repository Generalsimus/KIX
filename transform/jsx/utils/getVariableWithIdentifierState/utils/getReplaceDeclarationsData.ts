import ts from "typescript";
import { getVariableStatementData } from "./getVariableStatementData";

export const getReplaceDeclarationsData = (
    substituteBlockData: ReturnType<typeof getVariableStatementData>,
    variableDeclaration: ts.VariableDeclaration
) => {
    let replaceDeclarationsData = substituteBlockData.replaceDeclarations.get(variableDeclaration)
    if (!replaceDeclarationsData) {
        substituteBlockData.replaceDeclarations.set(variableDeclaration, replaceDeclarationsData = new Set());
    }
    return replaceDeclarationsData
}


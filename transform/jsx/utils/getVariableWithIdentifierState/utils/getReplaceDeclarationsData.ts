import ts from "typescript";
import { getVariableStatementData } from "./getVariableStatementData";

export const getReplaceDeclarationsData = (
    substituteBlockData: ReturnType<typeof getVariableStatementData>,
    variableDeclaration: ts.VariableDeclaration
) => {
    let replaceDeclarationsData = substituteBlockData.addAfterVariableDeclaration.get(variableDeclaration)
    if (!replaceDeclarationsData) {
        substituteBlockData.addAfterVariableDeclaration.set(variableDeclaration, replaceDeclarationsData = new Set());
    }
    return replaceDeclarationsData
}


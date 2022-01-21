import ts from "typescript"
import { elementAccessExpression } from "../factoryCode/elementAccessExpression"

export const getVariableDeclarationNode = (definedNames: string[]) => {
    if (definedNames.length === 1) {
        return ts.factory.createIdentifier(definedNames[0])
    }
    return elementAccessExpression(definedNames)
}
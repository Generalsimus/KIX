import ts from "typescript"
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression"

export const getVariableDeclarationNode = (definedNames: string[]) => {
    if (definedNames.length === 1) {
        return ts.factory.createIdentifier(definedNames[0])
    }
    return propertyAccessExpression(definedNames)
}
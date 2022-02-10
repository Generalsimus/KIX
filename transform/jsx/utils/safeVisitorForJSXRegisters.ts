import ts from "typescript"
import { CustomContextType } from "../.."

export const safeVisitorForJSXRegisters = (
    node: ts.ArrowFunction | ts.FunctionDeclaration,
    visitor: ts.Visitor,
    context: CustomContextType
) => {
    const OldGetRegistrationIdentifier = context.getJSXPropRegistrationIdentifier
    context.getJSXPropRegistrationIdentifier = undefined

    const newNode = ts.visitEachChild(node, visitor, context)

    context.getJSXPropRegistrationIdentifier = OldGetRegistrationIdentifier
    return newNode
}

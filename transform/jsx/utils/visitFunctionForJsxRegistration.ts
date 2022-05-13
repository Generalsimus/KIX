import ts from "typescript"
import { CustomContextType } from "../.."

export const visitFunctionForJsxRegistration = (node: ts.ArrowFunction | ts.FunctionDeclaration | ts.FunctionExpression, visitor: ts.Visitor, context: CustomContextType) => {
    const OldRegistrations = context.getJSXPropRegistrationIdentifier
    context.getJSXPropRegistrationIdentifier = undefined

    const newNode = ts.visitEachChild(node, visitor, context)

    context.getJSXPropRegistrationIdentifier = OldRegistrations
    return newNode
}
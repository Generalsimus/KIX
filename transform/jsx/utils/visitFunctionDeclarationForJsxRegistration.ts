import ts from "typescript"
import { CustomContextType } from "../.."

export const visitFunctionDeclarationForJsxRegistration = (node: ts.JsxSelfClosingElement, visitor: ts.Visitor, context: CustomContextType) => {
    const OldRegistrations = context.getJSXPropRegistrationIdentifier
    context.getJSXPropRegistrationIdentifier = undefined

    const newNode = ts.visitEachChild(node, visitor, context)

    context.getJSXPropRegistrationIdentifier = OldRegistrations
    return newNode
}
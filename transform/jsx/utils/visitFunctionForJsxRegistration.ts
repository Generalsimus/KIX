import ts from "typescript"
import { CustomContextType } from "../.."

export const visitFunctionForJsxRegistration = (node: ts.Node, visitor: ts.Visitor, context: CustomContextType) => {
    const OldRegistrations = context.getJSXPropRegistrationIdentifier;
    context.getJSXPropRegistrationIdentifier = undefined;

    const visitedNode = ts.visitEachChild(node, visitor, context);

    context.getJSXPropRegistrationIdentifier = OldRegistrations;
    return visitedNode
}
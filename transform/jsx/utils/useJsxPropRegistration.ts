import ts from "typescript";
import { CustomContextType } from "../..";
import { arrowFunction } from "../../factoryCode/arrowFunction";

export const useJsxPropRegistration = <T extends ts.Expression | undefined | void>(
    node: ts.Expression,
    visitor: ts.Visitor,
    context: CustomContextType,
    callBeforeReturn: (registererArrowFunctionNode: ts.Expression, isJSXregistererNode: boolean) => T
): T => {
    const OldGetRegistrationIdentifier = context.getJSXPropRegistrationIdentifier;
    let getRegistrationIdentifier: ts.Identifier | undefined
    context.getJSXPropRegistrationIdentifier = () => (getRegistrationIdentifier || (getRegistrationIdentifier = context.factory.createUniqueName("_R")));
    const newNode = visitor(node);
    context.getJSXPropRegistrationIdentifier = OldGetRegistrationIdentifier;
    if (getRegistrationIdentifier) {
        return callBeforeReturn(arrowFunction([getRegistrationIdentifier], [], newNode as ts.Expression), true)
    }

    return callBeforeReturn(newNode as typeof node, false)
}
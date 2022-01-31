import ts from "typescript";
import { CustomContextType } from "..";
import { arrowFunction } from "../factoryCode/arrowFunction";
import { callFunction } from "../factoryCode/callFunction";

export const useJsxPropRegistration = (node: ts.Expression, visitor: ts.Visitor, context: CustomContextType) => {
    const OldGetRegistrationIdentifier = context.getJSXPropRegistrationIdentifier;
    let getRegistrationIdentifier: ts.Identifier | undefined
    context.getJSXPropRegistrationIdentifier = () => (getRegistrationIdentifier || (getRegistrationIdentifier = context.factory.createUniqueName("__REGISTER")))
    const newNode = visitor(node)
    if (getRegistrationIdentifier) {

        return arrowFunction([getRegistrationIdentifier], [], callFunction(getRegistrationIdentifier, [arrowFunction([getRegistrationIdentifier], [], newNode as ts.Expression)]))
    }
    context.getJSXPropRegistrationIdentifier = OldGetRegistrationIdentifier;

    return node
}


export const PropertyAccessExpressionOrElementAccessExpression = (node: ts.PropertyAccessExpression | ts.ElementAccessExpression, visitor: ts.Visitor, context: CustomContextType) => {
    if (context.getJSXPropRegistrationIdentifier) {

        return visitor(callFunction(context.getJSXPropRegistrationIdentifier(), getExpressionNames(node)))
    }
    return ts.visitEachChild(node, visitor, context)
}


const getExpressionNames = (
    node: ts.PropertyAccessExpression | ts.ElementAccessExpression | ts.LeftHandSideExpression,
    expressionIdentifiers: ts.Expression[] = []
) => {
    if (ts.isPropertyAccessExpression(node)) {
        getExpressionNames(node.expression, expressionIdentifiers)
        expressionIdentifiers.push(node.name)
    } else if (ts.isElementAccessExpression(node)) {
        getExpressionNames(node.expression, expressionIdentifiers)
        expressionIdentifiers.push(node.argumentExpression)

    } else {
        expressionIdentifiers.push(node)
    }


    return expressionIdentifiers
}



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
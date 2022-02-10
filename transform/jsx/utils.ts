import ts, { createStringLiteral } from "typescript";
import { CustomContextType } from "..";
import { arrowFunction } from "../factoryCode/arrowFunction";
import { callFunction } from "../factoryCode/callFunction";
import { createObject } from "../factoryCode/createObject";
import { stringLiteral } from "../factoryCode/stringLiteral";

export const useJsxPropRegistration = <T extends ts.Expression | undefined | void>(
    node: ts.Expression,
    visitor: ts.Visitor,
    context: CustomContextType,
    callBeforeReturn: (registererArrowFunctionNode: ts.Expression, isJSXregistererNode: boolean) => T
): T => {
    const OldGetRegistrationIdentifier = context.getJSXPropRegistrationIdentifier;
    let getRegistrationIdentifier: ts.Identifier | undefined
    context.getJSXPropRegistrationIdentifier = () => (getRegistrationIdentifier || (getRegistrationIdentifier = context.factory.createUniqueName("_R")))
    const newNode = visitor(node)
    if (getRegistrationIdentifier) {
        return callBeforeReturn(arrowFunction([getRegistrationIdentifier], [], newNode as ts.Expression), true)
    }
    context.getJSXPropRegistrationIdentifier = OldGetRegistrationIdentifier;

    return callBeforeReturn(newNode as typeof node, false)
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
        expressionIdentifiers.push(stringLiteral(node.name.getText()))
    } else if (ts.isElementAccessExpression(node)) {
        getExpressionNames(node.expression, expressionIdentifiers)
        expressionIdentifiers.push(node.argumentExpression)

    } else {
        expressionIdentifiers.push(node)
    }


    return expressionIdentifiers
}

export const forEachJsxAttributes = (
    attributeProperties: ts.JsxAttributes["properties"],
    forEachCallback: (attributeName: string, attributeValueNode: ts.Expression) => void
) => {
    for (const attribute of attributeProperties) {
        if (attribute.kind === ts.SyntaxKind.JsxAttribute) {
            const attributeName = attribute.name.getText()
            let attributeValueNode = safeInitializer(attribute.initializer)
            if (!attributeValueNode) continue;
            if (ts.isJsxText(attributeValueNode)) {
                attributeValueNode = stringLiteral(attributeValueNode.getText())
            }
            forEachCallback(attributeName, attributeValueNode)

        }
    }

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



export const createJsxChildrenNode = (
    visitor: ts.Visitor,
    context: CustomContextType,
    children: ts.NodeArray<ts.JsxChild>
) => {
    const newChildren = children.reduce((newChildren: ts.Expression[], child, index) => {
        let currentChild = safeInitializer(child)
        if (!currentChild) {
            return newChildren
        }

        if (ts.SyntaxKind.JsxText === currentChild.kind) {
            const jsxText = currentChild.getText()
            if (jsxText.trim().length === 0) {
                return newChildren
            }
            newChildren.push(stringLiteral(jsxText))
        } else {

            newChildren.push(useJsxPropRegistration(currentChild, visitor, context, (node, isRegisterNode) => {
                if (isRegisterNode) {
                    return createObject([
                        ["_R", node]
                    ])
                }

                return node
            }))
        }

        return newChildren
    }, [])
    return newChildren.length === 1 ? newChildren[0] : context.factory.createArrayLiteralExpression(newChildren, false)
}

export const safeInitializer = (initializer: ts.JsxChild | ts.StringLiteral | ts.JsxExpression | undefined) => {
    if (!initializer) return;
    if (initializer.kind === ts.SyntaxKind.JsxExpression) {
        if (!initializer.expression) {
            return
        }
        return initializer.expression
    }
    return initializer
}
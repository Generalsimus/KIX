import ts, { isStringLiteralLike } from "typescript";
import { CustomContextType } from "..";
import { createObject, createObjectArgsType } from "../factoryCode/createObject";
import { stringLiteral } from "../factoryCode/stringLiteral";


// (visitor, CTX, tagName, attributes, children)
export const jsxToObject = (
    visitor: ts.Visitor,
    context: CustomContextType,
    tagName: ts.JsxTagNameExpression,
    attributes: ts.JsxAttributes,
    children: ts.NodeArray<ts.JsxChild>) => {
    const newChildren = children.reduce((newChildren: ts.Expression[], child, index) => {
        const currentChild = safeInitializer(child)
        if (!currentChild) {
            return newChildren
        }
        if (ts.SyntaxKind.JsxText === currentChild.kind) {
            if (index === 0 || index === (children.length - 1)) {
                const jsxText = currentChild.getText().trim()
                if (jsxText.length === 0) {
                    return newChildren
                }
            }
            newChildren.push(stringLiteral(currentChild.getText()))
        } else {
            newChildren.push(currentChild)
        }

        return newChildren
    }, [])
    const objectNodeProperties: createObjectArgsType = [
        [
            tagName.getText(), context.factory.createArrayLiteralExpression(
                newChildren,
                false
            )
        ]
    ]

    const eventObjectNodeProperties: createObjectArgsType = []
    for (const attribute of attributes.properties) {
        if (attribute.kind === ts.SyntaxKind.JsxAttribute) {
            const attributeName = attribute.name.getText()
            const attributeValueNode = safeInitializer(attribute.initializer)

            if (!attributeValueNode) continue;
            if (/^(on+[A-Z])/.test(attributeName)) {
                if (ts.isJsxText(attributeValueNode)) continue;

                eventObjectNodeProperties.push([attributeName.replace(/^on/, "").toLowerCase(), attributeValueNode])
            } else if (attributeName === "e") {
                if (ts.isJsxText(attributeValueNode)) continue;
                if (ts.isObjectLiteralExpression(attributeValueNode)) {
                    eventObjectNodeProperties.push(...attributeValueNode.properties)
                } else {
                    eventObjectNodeProperties.push(attributeValueNode)
                }
            } else {
                let attributeValue: ts.Expression | undefined
                if (ts.isJsxText(attributeValueNode)) {
                    attributeValue = stringLiteral(attributeValueNode.getText())
                } else {
                    attributeValue = attributeValueNode
                }
                objectNodeProperties.push([attributeName, attributeValue])
            }
        }
    }
    if (eventObjectNodeProperties.length > 0) {
        objectNodeProperties.push(["e", createObject(eventObjectNodeProperties)])
    }


    return createObject(objectNodeProperties)
}


const safeInitializer = (initializer: ts.JsxChild | ts.StringLiteral | ts.JsxExpression | undefined) => {
    if (!initializer) return;
    if (initializer.kind === ts.SyntaxKind.JsxExpression) {
        if (!initializer.expression) {
            return
        }
        return initializer.expression
    }
    return initializer
}


import ts from "typescript";
import { CustomContextType } from "..";
import { arrowFunction } from "../factoryCode/arrowFunction";
import { callClass } from "../factoryCode/callClass";
import { callFunction } from "../factoryCode/callFunction";
import { createObject, createObjectArgsType } from "../factoryCode/createObject";
import { stringLiteral } from "../factoryCode/stringLiteral";
import { createJsxChildrenNode } from "./utils/createJsxChildrenNode";
import { forEachJsxAttributes } from "./utils/forEachJsxAttributes";
import { useJsxPropRegistration } from "./utils/useJsxPropRegistration";



export const jsxToObject = (
    visitor: ts.Visitor,
    context: CustomContextType,
    tagName: ts.JsxTagNameExpression,
    attributes: ts.JsxAttributes,
    children: ts.NodeArray<ts.JsxChild>
) => {
    const childrenNode = createJsxChildrenNode(
        visitor,
        context,
        children
    )
    const tagNameToString = tagName.getText();
    if (/[A-Z]/.test(tagNameToString)) {
        return createJSXComponent(
            visitor,
            context,
            tagName,
            attributes,
            children
        )
    }
    // newChildren.length === 1 ? newChildren[0] : context.factory.createArrayLiteralExpression(newChildren),
    const objectNodeProperties: createObjectArgsType = [
        [tagName.getText(), childrenNode]
    ]

    const eventObjectNodeProperties: createObjectArgsType = []
    const dynamicObjectNodeProperties: createObjectArgsType = []
    forEachJsxAttributes(attributes.properties, (attributeName, attributeValueNode) => {
        if (/^(on+[A-Z])/.test(attributeName)) {

            eventObjectNodeProperties.push([attributeName.replace(/^on/, "").toLowerCase(), attributeValueNode])
        } else if (attributeName === "e") {
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
            useJsxPropRegistration(attributeValue, visitor, context, (node, isRegisterNode) => {
                if (isRegisterNode) {
                    dynamicObjectNodeProperties.push([attributeName, node])
                } else {
                    objectNodeProperties.push([attributeName, node])
                }
            })
        }
    })
    if (dynamicObjectNodeProperties.length) {
        objectNodeProperties.push(["_R", createObject(dynamicObjectNodeProperties)])
    }
    if (eventObjectNodeProperties.length) {
        objectNodeProperties.push(["e", createObject(eventObjectNodeProperties)])
    }


    return createObject(objectNodeProperties)
}




const createJSXComponent = (
    visitor: ts.Visitor,
    context: CustomContextType,
    tagName: ts.JsxTagNameExpression,
    attributes: ts.JsxAttributes,
    children: ts.NodeArray<ts.JsxChild>
) => {
    const childrenNode = createJsxChildrenNode(
        visitor,
        context,
        children
    )

    const propsObjectNodesForFactoryCode: [string, ts.Expression][] = [
        ["children", childrenNode]
    ]

    forEachJsxAttributes(attributes.properties, (attributeName, attributeValueNode) => {
        propsObjectNodesForFactoryCode.push([attributeName, attributeValueNode])
    })
    const componentRegistryIdentifier = context.factory.createUniqueName("RC")
    return useJsxPropRegistration(
        createObject(propsObjectNodesForFactoryCode),
        visitor,
        context,
        (node, isJSXregistererNode) => {
            const createComponentNode = ts.isIdentifier(tagName) ? callFunction : callFunction
            return createObject([
                [
                    "_C",
                    arrowFunction(
                        [componentRegistryIdentifier],
                        [],
                        createComponentNode(tagName, (isJSXregistererNode ? [
                            callFunction(
                                componentRegistryIdentifier,
                                [node]
                            )
                        ] : [node]))

                    )
                ],
            ])
        }
    )
}
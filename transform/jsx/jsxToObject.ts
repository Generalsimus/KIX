import ts from "typescript";
import { CustomContextType } from "..";
import { createObject, createObjectArgsType } from "../factoryCode/createObject";
import { stringLiteral } from "../factoryCode/stringLiteral";
import { createJsxChildrenNode } from "./utils/createJsxChildrenNode";
import { forEachJsxAttributes } from "./utils/forEachJsxAttributes";
import { useJsxPropRegistration } from "./utils/useJsxPropRegistration";
import { createJSXComponent } from "./utils/createJSXComponent";


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
        const attributeNameString = ts.idText(attributeName)
        if (/^(on+[A-Z])/.test(attributeNameString)) {

            eventObjectNodeProperties.push([attributeNameString.replace(/^on/, "").toLowerCase(), attributeValueNode])
        } else if (attributeNameString === "e") {
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



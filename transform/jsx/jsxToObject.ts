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
            // attributeValueNode = visitor(attributeValueNode) as ts.Expression
            eventObjectNodeProperties.push([
                attributeNameString.replace(/^on/, "").toLowerCase(),
                visitor(attributeValueNode) as ts.Expression
            ])
        } else if (attributeNameString === "e") {
            attributeValueNode = visitor(attributeValueNode) as ts.Expression
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
    /*
    _D:switch (tagName.getText()) {}
     atr: _R_1 => (_R_1(s, "i"))
    */

    if (eventObjectNodeProperties.length) {

        objectNodeProperties.push(["e", createObject(eventObjectNodeProperties)])
    }
    if (dynamicObjectNodeProperties.length) {
        return createObject([["_D", createObject(objectNodeProperties)], ...dynamicObjectNodeProperties])
    }

    return createObject(objectNodeProperties)
}



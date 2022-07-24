import ts from "typescript";
import { CustomContextType } from "..";
import { createObject, createObjectArgsType } from "../factoryCode/createObject";
import { stringLiteral } from "../factoryCode/stringLiteral";
import { createJsxChildrenNode } from "./utils/createJsxChildrenNode";
import { forEachJsxAttributes } from "./utils/forEachJsxAttributes";
import { useJsxPropRegistration } from "./utils/useJsxPropRegistration";
import { createJSXComponent } from "./utils/createJSXComponent";

const getTagNameString = (tagName: ts.JsxTagNameExpression, tagNameToString?: string) => {
    if (ts.isIdentifier(tagName)) {
        const tagNameString = ts.idText(tagName);
        if (!(/[A-Z]/.test(tagNameString))) {
            tagNameToString = tagNameString
        }
    } else if (tagName.kind === ts.SyntaxKind.ThisKeyword) {
        tagNameToString = "this"
    }
    return tagNameToString
}
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
    // Identifier | ThisExpression | JsxTagNamePropertyAccess;
    const tagNameToString = getTagNameString(tagName);
    if (tagNameToString) {
        const objectNodeProperties: createObjectArgsType = [
            [tagNameToString, childrenNode]
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
            } else if (ts.isJsxText(attributeValueNode)) {
                objectNodeProperties.push([attributeName, stringLiteral(attributeValueNode.text)])
                return
            } else {
                useJsxPropRegistration(attributeValueNode, visitor, context, (node, isRegisterNode) => {
                    if (isRegisterNode) {
                        dynamicObjectNodeProperties.push([attributeName, node])
                    } else {
                        objectNodeProperties.push([attributeName, node])
                    }
                })
            }
        })
        /*
        ტეგის აბსტარაქცია გამოიყურება ესე
        const abstraction = {
            ["tagName"]: [], ტეგის სახელი და შვილები
            $D: {}, // დინამიური დომის რეგისტრატორი მაგრამ ყველა ექსპრეს ჩაილდი მანდ შედის
            $E: {}, //ევენთები
            "...ATTRIBUTES": []
        }
        */
        if (eventObjectNodeProperties.length) {

            objectNodeProperties.push(["$E", createObject(eventObjectNodeProperties)])
        }
        if (dynamicObjectNodeProperties.length) {
            return createObject([["$D", createObject(objectNodeProperties)], ...dynamicObjectNodeProperties])
        }

        return createObject(objectNodeProperties)
    }

    return createJSXComponent(
        visitor,
        context,
        tagName,
        attributes,
        children
    )
}



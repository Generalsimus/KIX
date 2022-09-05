import ts from "typescript";
import { CustomContextType } from "..";
import { createObject, createObjectArgsType } from "../factoryCode/createObject";
import { stringLiteral } from "../factoryCode/stringLiteral";
import { createJsxChildrenNode } from "./utils/createJsxChildrenNode";
import { forEachJsxAttributes } from "./utils/forEachJsxAttributes";
import { useJsxPropRegistration } from "./utils/useJsxPropRegistration";
import { createJSXComponent } from "./utils/createJSXComponent";
import { arrowFunction } from "../factoryCode/arrowFunction";

const getTagNameString = (tagName: ts.JsxTagNameExpression, tagNameToString?: string) => {
    if (ts.isIdentifier(tagName)) {
        const tagNameString = ts.idText(tagName);
        if (/^([a-z]|\d+|\-|\:)*$/.test(tagNameString)) {
            return tagNameString
        }
    } else if (tagName.kind === ts.SyntaxKind.ThisKeyword) {
        return "this"
    }
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
            [
                tagNameToString,
                childrenNode || context.factory.createArrayLiteralExpression([], false)
            ]
        ]




        const xmlnsNodeProperties: createObjectArgsType = [];
        const eventObjectNodeProperties: createObjectArgsType = [];
        const dynamicObjectNodeProperties: createObjectArgsType = [];
        let haveDefaultXmlns: boolean = false;
        forEachJsxAttributes(attributes.properties, (attributeName, attributeValueNode) => {
            const attributeNameString = ts.idText(attributeName)


            if (/^(on+[A-Z])/.test(attributeNameString)) {
                eventObjectNodeProperties.push([
                    attributeNameString.replace(/^on/, "").toLowerCase(),
                    visitor(attributeValueNode) as typeof attributeValueNode
                ])
            } else if (ts.isJsxText(attributeValueNode) || ts.isStringLiteral(attributeValueNode)) {
                const attributeStringNode = stringLiteral(attributeValueNode.text);

                if (attributeNameString.startsWith("xmlns:")) {
                    // xmlnsNodeProperties[attributeNameString.replace(/^(xmlns\:)/, "")] = attributeStringNode
                    xmlnsNodeProperties.push(
                        [attributeNameString.replace(/^(xmlns\:)/, ""), attributeStringNode]
                    );
                } else if (attributeNameString === "xmlns") {
                    haveDefaultXmlns = true;
                    // xmlnsNodeProperties["$D"] = attributeStringNode
                    xmlnsNodeProperties.push(
                        ["$D", attributeStringNode]
                    );
                } else {
                    objectNodeProperties.push([attributeName, attributeStringNode]);
                }
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

        const elementConstruction: createObjectArgsType = [];

        if (eventObjectNodeProperties.length) {
            elementConstruction.push([
                "E",
                arrowFunction(
                    [],
                    [],
                    createObject(eventObjectNodeProperties)
                )
            ]);
        }
        if (dynamicObjectNodeProperties.length) {
            elementConstruction.push([
                "D",
                createObject(dynamicObjectNodeProperties)
            ]);
        }


        let returnElementNode = createObject(objectNodeProperties);

        if (elementConstruction.length) {
            returnElementNode = createObject([
                ["$", returnElementNode],
                ...elementConstruction
            ]);
        }
        if (tagNameToString === "svg" && !haveDefaultXmlns) {
            xmlnsNodeProperties.push(
                ['$D', stringLiteral("http://www.w3.org/2000/svg")]
            )
        }
        if (xmlnsNodeProperties.length) {
            returnElementNode = createObject([
                ['$X', returnElementNode],
                ...xmlnsNodeProperties
            ]);
        }
        return returnElementNode;
    }

    return createJSXComponent(
        visitor,
        context,
        tagName,
        attributes,
        children
    )
}



/*
// for svg Element
 $S ტეგის სახელი ტრანსფოტმისას ეს გახადე
*/
/*
// element structure

const elemens = {
    $: { div: [] }
    D: {
        class: (reg) => reg(es, "sss")
    }
    E: () => ({
        click: (event, element) => {

        }
    })
}; 
*/
/*
// component structure

const elemens = {
    $C: Component
    i:[],
    a:{}
    d:{}
}; 
*/
/*
// dynamic child structure

const elemens = {
    $D: ()=>() 
}; 
*/
/*
// NS element structure

const elemens = {
    $X:{}
    $D:"",
    h:"http://www.w3.org/TR/html4/"
    f="http://www.w3schools.com/furniture"
}; 
*/
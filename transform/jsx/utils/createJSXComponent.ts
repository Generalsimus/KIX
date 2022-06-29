import ts from "typescript"
import { CustomContextType } from "../.."
import { arrowFunction } from "../../factoryCode/arrowFunction"
import { callFunction } from "../../factoryCode/callFunction"
import { createObject } from "../../factoryCode/createObject"
import { propertyAccessExpression } from "../../factoryCode/propertyAccessExpression"
import { createJsxChildrenNode } from "./createJsxChildrenNode"
import { forEachJsxAttributes } from "./forEachJsxAttributes"
import { getExpressionNames } from "./getExpressionNames"
import { useJsxPropRegistration } from "./useJsxPropRegistration"

//TODO:კლასის კომპენენტის შემთXვევაში უნდა იყოს ასე new ClassName().method() და არა ესე new ClassName.method()
export const createJSXComponent = (
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

    const propsObjectNodesForFactoryCode: [ts.Identifier | string, ts.Expression][] = [
        ["_F", tagName],
        ["c", childrenNode]
    ]

    const dynamicPropsObjectNodesForFactoryCode: [ts.Identifier | string, ts.Expression][] = []
    const staticPropsObjectNodesForFactoryCode: [ts.Identifier | string, ts.Expression][] = []


    forEachJsxAttributes(attributes.properties, (attributeName, attributeValueNode) => {
        useJsxPropRegistration(
            attributeValueNode,
            visitor,
            context,
            (node, isJSXregistererNode) => {
                if (isJSXregistererNode) {
                    dynamicPropsObjectNodesForFactoryCode.push([attributeName, node])
                } else {
                    staticPropsObjectNodesForFactoryCode.push([attributeName, node])
                }
            }
        )
    })
    if (dynamicPropsObjectNodesForFactoryCode.length) {
        propsObjectNodesForFactoryCode.push(["d", createObject(dynamicPropsObjectNodesForFactoryCode)])
    }
    /*
    
    (_P)=>(_R({}),_R({}),FooComponent)
    */

    if (staticPropsObjectNodesForFactoryCode.length) {
        propsObjectNodesForFactoryCode.push(["s", createObject(staticPropsObjectNodesForFactoryCode)])
    }

    // const componentRegistryIdentifier = context.factory.createUniqueName("RC")

    return createObject(propsObjectNodesForFactoryCode);
}
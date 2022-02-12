import ts from "typescript"
import { CustomContextType } from "../.."
import { arrowFunction } from "../../factoryCode/arrowFunction"
import { callFunction } from "../../factoryCode/callFunction"
import { createObject } from "../../factoryCode/createObject"
import { createJsxChildrenNode } from "./createJsxChildrenNode"
import { forEachJsxAttributes } from "./forEachJsxAttributes"
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
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
            const createComponentNode = ts.isIdentifier(tagName) ? callFunction : callFunction;
            console.log("🚀 --> file: createJSXComponent.ts --> line 38 --> tagName", ts.SyntaxKind[tagName.kind]);
            // console.log("🚀 --> file: createJSXComponent.ts --> line 41 --> ExpressionNames", ExpressionNames);
            let componentCallNameNode: ts.ElementAccessExpression | ts.PropertyAccessExpression | ts.JsxTagNameExpression = tagName;
            if (ts.isPropertyAccessExpression(tagName)) {
                const ExpressionNames = getExpressionNames(tagName)
                ExpressionNames[0] = callFunction(ExpressionNames[0], [], "createNewExpression")
                componentCallNameNode = propertyAccessExpression(ExpressionNames)
            }

            // "createCallExpression" | "createNewExpression"
            return createObject([
                [
                    "_C",
                    arrowFunction(
                        [componentRegistryIdentifier],
                        [],
                        callFunction(
                            componentCallNameNode,
                            (isJSXregistererNode ? [
                                callFunction(
                                    componentRegistryIdentifier,
                                    [node]
                                )
                            ] : [node])
                            // (ts.isIdentifier(tagName) ? "createCallExpression" : "createNewExpression")
                        )

                    )
                ],
            ])
        }
    )
}
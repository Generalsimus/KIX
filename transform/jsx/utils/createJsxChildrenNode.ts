import ts from "typescript"
import { CustomContextType } from "../.."
import { createObject } from "../../factoryCode/createObject"
import { stringLiteral } from "../../factoryCode/stringLiteral"
import { safeInitializer } from "./safeInitializer"
import { useJsxPropRegistration } from "./useJsxPropRegistration"

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
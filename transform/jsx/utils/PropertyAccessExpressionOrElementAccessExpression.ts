import ts from "typescript"
import { CustomContextType } from "../.."
import { callFunction } from "../../factoryCode/callFunction"
import { getExpressionNames } from "./getExpressionNames"

export const PropertyAccessExpressionOrElementAccessExpression = (node: ts.PropertyAccessExpression | ts.ElementAccessExpression, visitor: ts.Visitor, context: CustomContextType) => {
    if (context.getJSXPropRegistrationIdentifier) {


        return visitor(callFunction(context.getJSXPropRegistrationIdentifier(), getExpressionNames(node)))
    }
    return ts.visitEachChild(node, visitor, context)
}
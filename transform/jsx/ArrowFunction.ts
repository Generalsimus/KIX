import ts, { visitEachChild } from "typescript";
import { CustomContextType } from "..";
import { NumberToUniqueString } from "../../utils/numberToUniqueString";
import { createObject, createObjectArgsType } from "../factoryCode/createObject";
import { identifier } from "../factoryCode/identifier";
import { nodeToken } from "../factoryCode/nodeToken";
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression";
import { variableStatement } from "../factoryCode/variableStatement";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { createBlockVisitor } from "./utils/createBlockVisitor";
import { createBlockNodeDeclarationUpdate } from "./utils/createBlockVisitorDeclaration";
import { getIdentifierState } from "./utils/getIdentifierState";

export const ArrowFunction = createBlockVisitor(createBlockNodeDeclarationUpdate(
    (visitedNode: ts.ArrowFunction, declarationNode, context) => {
        return context.factory.updateArrowFunction(
            visitedNode,
            visitedNode.modifiers,
            visitedNode.typeParameters,
            visitedNode.parameters,
            visitedNode.type,
            visitedNode.equalsGreaterThanToken,
            ConciseBodyToMultiLineBlock(visitedNode.body, context, [
                declarationNode,
            ]),
        )
    }
))

const ConciseBodyToMultiLineBlock = (body: ts.ConciseBody, context: CustomContextType, addStatement: ts.Statement[] = []) => {
    if (ts.isBlock(body)) {
        return context.factory.updateBlock(body, [...addStatement, ...body.statements])
    }

    return context.factory.createBlock([
        ...addStatement,
        context.factory.createReturnStatement(body)
    ], true)
}
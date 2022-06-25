import ts from "typescript";
import { CustomContextType } from "..";
import { NumberToUniqueString } from "../../utils/numberToUniqueString";
import { createObject } from "../factoryCode/createObject";
import { identifier } from "../factoryCode/identifier";
import { variableStatement } from "../factoryCode/variableStatement";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";
import { createForInOfVisitor } from "./utils/createForInOfVisitor";
import { getIdentifierState } from "./utils/getIdentifierState";

export const ForOfStatement = createForInOfVisitor(
    (node: ts.ForOfStatement, statement, context) => {
        return context.factory.updateForOfStatement(
            node,
            node.awaitModifier,
            node.initializer,
            node.expression,
            statement,
        )
    }
)
//  createForInOfVisitor(ts.factory.updateForOfStatement)
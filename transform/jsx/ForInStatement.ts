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

export const ForInStatement = createForInOfVisitor(
    (node: ts.ForInStatement, statement, context) => {
        return context.factory.updateForInStatement(
            node,
            node.initializer,
            node.expression,
            statement,
        )
    }
)
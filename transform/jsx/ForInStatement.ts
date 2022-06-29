import ts from "typescript";
import { createForInOfVisitor } from "./utils/createForInOfVisitor";

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
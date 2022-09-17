import ts from "typescript"
import { identifier } from "./identifier"

export const callFunction = (
    name: string | ts.Expression,
    args: (ts.Expression | string)[] = [],
    callTypeName: "createCallExpression" | "createNewExpression" = "createCallExpression"
) => {
    return ts.factory[callTypeName](
        identifier(name),
        undefined,
        args.map(identifier),
    )
}
import ts from "typescript"
import { identifier } from "./identifier"

export const callFunction = (name: string | ts.Expression, args: (ts.Expression | string)[] = []) => {
    return ts.factory.createCallExpression(
        identifier(name),
        undefined,
        args.map(identifier),
    )
}
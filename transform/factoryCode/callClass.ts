import ts from "typescript"
import { identifier } from "./identifier"

export const callClass = (name: string | ts.Expression, args: (ts.Expression | string)[] = []) => {
    return ts.factory.createNewExpression(
        identifier(name),
        undefined,
        args.map(identifier),
    )
}
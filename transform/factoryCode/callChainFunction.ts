import ts from "typescript"
import { identifier } from "./identifier"

export const callChainFunction = (
    name: string | ts.Expression,
    args: (ts.Expression | string)[] = []
) => {
    return ts.factory.createCallChain(
        identifier(name),
        ts.factory.createToken(ts.SyntaxKind.QuestionDotToken),
        undefined,
        args.map(identifier),
    );
}
import ts from "typescript";

export const safeInitializer = (initializer: ts.JsxChild | ts.StringLiteral | ts.JsxExpression | undefined) => {
    if (!initializer) return;
    if (initializer.kind === ts.SyntaxKind.JsxExpression) {
        if (!initializer.expression) {
            return
        }
        return initializer.expression
    }
    return initializer
}



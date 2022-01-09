import ts from "typescript";

export const codeTransformer = (sourceFile: ts.SourceFile, compilerOptions: ts.CompilerOptions) => {
    return ts.transform(
        sourceFile,
        [
            (context) => {
                // (transpilerBefore[NODE.kind] || visitEachChild)(NODE, visitor, CTX)
                const visitor = (node: ts.Node): ts.Node | undefined => {

                    return ts.forEachChild(node, visitor,);
                }
                return visitor as any
                // return (node) => ts.visitNode(node, visitor)

            }
        ],
        compilerOptions
    );
}
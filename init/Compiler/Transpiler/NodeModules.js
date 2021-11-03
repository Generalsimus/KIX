import { createIdentifier, SyntaxKind } from "typescript"

export const NodeModuleTransformersBefore = {
    [SyntaxKind.CallExpression]: (NODE, visitor, CTX) => {
        console.log("🚀 ---> file: transpilers.js ---> line 43 ---> .escapedText", NODE.expression.escapedText)
        if (NODE.expression.escapedText === "require") {
            // console.log(CTX.ModuleColection)
            return createIdentifier("ssssssssssssss")
        }

        // return createIdentifier("ssssssssssssss")
        return NODE
    },
}
import { createIdentifier, SyntaxKind } from "typescript"
import { visitEachChild } from "typescript/lib/tsserverlibrary"
import { generateFactory } from "./createFactoryCode"
import { geModuleLocationMeta } from "./utils"

export const NodeModuleTransformersBefore = {
    // [SyntaxKind.CallExpression]: (NODE, visitor, CTX) => {
    //     console.log("🚀 ---> file: transpilers.js ---> line 43 ---> .escapedText", NODE.expression.escapedText)
    //     if (NODE.expression.escapedText === "require") {
    //         // console.log(CTX.ModuleColection)
    //         return createIdentifier("ssssssssssssss")
    //     }

    //     // return createIdentifier("ssssssssssssss")
    //     return NODE
    // }, 
    [SyntaxKind.CallExpression]: (NODE, visitor, CTX) => {
        if (NODE.expression.escapedText === "require" && NODE.arguments[0]?.kind === SyntaxKind.StringLiteral) {
            const compilerOptions = CTX.getCompilerOptions()



            const ModuleData = geModuleLocationMeta(CTX.ModuleColection[NODE.arguments[0].text], compilerOptions)
            if (ModuleData) {
                return generateFactory.CREATE_Element_Access_Expression(ModuleData)
            }
        }

        return visitEachChild(NODE, visitor, CTX)
    },
    // [SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
    //     NODE.fileName = NODE.fileName + ".json"
    //     return NODE
    // }
}
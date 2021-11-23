"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeModuleTransformersBefore = void 0;
const typescript_1 = require("typescript");
const tsserverlibrary_1 = require("typescript/lib/tsserverlibrary");
const createFactoryCode_1 = require("./createFactoryCode");
const utils_1 = require("./utils");
exports.NodeModuleTransformersBefore = {
    // [SyntaxKind.CallExpression]: (NODE, visitor, CTX) => {
    //     console.log("🚀 ---> file: transpilers.js ---> line 43 ---> .escapedText", NODE.expression.escapedText)
    //     if (NODE.expression.escapedText === "require") {
    //         // console.log(CTX.ModuleColection)
    //         return createIdentifier("ssssssssssssss")
    //     }
    //     // return createIdentifier("ssssssssssssss")
    //     return NODE
    // }, 
    [typescript_1.SyntaxKind.CallExpression]: (NODE, visitor, CTX) => {
        if (NODE.expression.escapedText === "require" && NODE.arguments[0]?.kind === typescript_1.SyntaxKind.StringLiteral) {
            const compilerOptions = CTX.getCompilerOptions();
            const ModuleData = (0, utils_1.geModuleLocationMeta)(CTX.ModuleColection[NODE.arguments[0].text], compilerOptions);
            if (ModuleData) {
                return createFactoryCode_1.generateFactory.CREATE_Element_Access_Expression(ModuleData);
            }
        }
        return (0, tsserverlibrary_1.visitEachChild)(NODE, visitor, CTX);
    },
    // [SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
    //     NODE.fileName = NODE.fileName + ".json"
    //     return NODE
    // }
};

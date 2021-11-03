"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeModuleTransformersBefore = void 0;
const typescript_1 = require("typescript");
exports.NodeModuleTransformersBefore = {
    [typescript_1.SyntaxKind.CallExpression]: (NODE, visitor, CTX) => {
        console.log("🚀 ---> file: transpilers.js ---> line 43 ---> .escapedText", NODE.expression.escapedText);
        if (NODE.expression.escapedText === "require") {
            // console.log(CTX.ModuleColection)
            return (0, typescript_1.createIdentifier)("ssssssssssssss");
        }
        // return createIdentifier("ssssssssssssss")
        return NODE;
    },
};
//# sourceMappingURL=NodeModules.js.map
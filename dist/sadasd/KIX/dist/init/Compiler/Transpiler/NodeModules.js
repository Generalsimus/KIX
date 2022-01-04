"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeModuleTransformersBefore = void 0;
const typescript_1 = require("typescript");
const tsserverlibrary_1 = require("typescript/lib/tsserverlibrary");
const createFactoryCode_1 = require("./createFactoryCode");
const utils_1 = require("./utils");
exports.NodeModuleTransformersBefore = {
    [typescript_1.SyntaxKind.CallExpression]: (NODE, visitor, CTX) => {
        var _a;
        if (NODE.expression.escapedText === "require" && ((_a = NODE.arguments[0]) === null || _a === void 0 ? void 0 : _a.kind) === typescript_1.SyntaxKind.StringLiteral) {
            const compilerOptions = CTX.getCompilerOptions();
            const ModuleData = (0, utils_1.geModuleLocationMeta)(CTX.ModuleColection[NODE.arguments[0].text], compilerOptions);
            if (ModuleData) {
                return createFactoryCode_1.generateFactory.CREATE_Element_Access_Expression(ModuleData);
            }
        }
        return (0, tsserverlibrary_1.visitEachChild)(NODE, visitor, CTX);
    },
};

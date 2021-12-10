"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleTransformersAfter = exports.ModuleTransformersBefore = exports.visited_SourceFiles = void 0;
const typescript_1 = __importStar(require("typescript"));
const createFactoryCode_1 = require("./createFactoryCode");
const utils_1 = require("./utils");
const amdBodyVisitor_1 = require("./amdBodyVisitor");
const App_1 = require("../../App");
// console.log("🚀 ---> file: Module.js ---> line 16 ---> TransformFlags", TransformFlags)
const { ContainsDynamicImport } = typescript_1.TransformFlags;
const { createStringLiteral, createCallExpression, createUniqueName, createExpressionStatement, createParenthesizedExpression, createReturnStatement, createIdentifier, } = typescript_1.factory;
exports.visited_SourceFiles = new Map();
exports.ModuleTransformersBefore = {
    [typescript_1.SyntaxKind.ExportKeyword]: (NODE, visitor, CTX) => {
        // console.log("🚀 --> file: Module.js --> line 49 --> NODE", NODE)/
    },
    [typescript_1.SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
        // console.log("🚀 --> file: Module.js --> line 61 --> NODE", Object.keys(NODE));
        // return NODE
        // console.log("🚀 --> file: Module.js --> line 58 --> CTX", CTX);
        // if (NODE.before_visited) return NODE
        const visited_NODE = exports.visited_SourceFiles.get(NODE.originalFileName);
        // const visited_NODE = FilesThree.get(NODE.path)
        if (visited_NODE) {
            return visited_NODE;
        }
        const compilerOptions = CTX.getCompilerOptions();
        const moduleInfo = (0, utils_1.getOrSetModuleInfo)(NODE.originalFileName, compilerOptions);
        CTX.ModuleColection = (0, utils_1.configModules)(NODE, moduleInfo, compilerOptions);
        if (!moduleInfo.isNodeModule && !moduleInfo.fileWatcher && App_1.App.__Dev_Mode) {
            (0, utils_1.watchModuleFileChange)(NODE, moduleInfo, compilerOptions);
        }
        try {
            if (typescript_1.default.isJsonSourceFile(NODE)) {
                NODE = typescript_1.default.updateSourceFileNode(NODE, [
                    createExpressionStatement(createFactoryCode_1.generateFactory.CREATE_Export_File_Function(NODE.statements.map((node) => {
                        return typescript_1.factory.createExpressionStatement(createFactoryCode_1.generateFactory.CREATE_Equals_Token_Nodes([
                            createFactoryCode_1.generateFactory.CREATE_Property_Access_Expression(["exports", "default"]),
                            node.expression
                        ]));
                    }), compilerOptions.__Import_Module_Name, moduleInfo.Module_INDEX, compilerOptions.rootNames.includes(NODE.originalFileName)))
                ]);
                // ეს იმიტომ json ის ტრანსპილირება რო არ მოხდეს amd ში
                NODE.scriptKind = typescript_1.ScriptKind.Unknown;
            }
            else {
                NODE = typescript_1.default.updateSourceFileNode(NODE, [
                    createExpressionStatement(createFactoryCode_1.generateFactory.CREATE_Export_File_Function(NODE.statements.flatMap((statementNode) => (0, amdBodyVisitor_1.topLevelVisitor)(statementNode, NODE, CTX)), compilerOptions.__Import_Module_Name, moduleInfo.Module_INDEX, compilerOptions.rootNames.includes(NODE.originalFileName)))
                ]);
                if (NODE.isCSSFile) {
                    NODE.fileName = NODE.fileName + ".json";
                }
            }
            NODE.externalModuleIndicator = undefined;
        }
        catch (error) {
            console.log(error);
        }
        if (!CTX.Module_GET_POLYFIL) {
            NODE.statements.splice(0, 0, (CTX.Module_GET_POLYFIL = createFactoryCode_1.generateFactory.CREATE_Module_GET_POLYFIL(compilerOptions.__Import_Module_Name)));
        }
        NODE = (0, typescript_1.visitEachChild)(NODE, visitor, CTX);
        exports.visited_SourceFiles.set(NODE.originalFileName, NODE);
        return NODE;
    }
};
exports.ModuleTransformersAfter = {
// [SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
//     if (NODE.After_visited) return NODE
//     NODE.After_visited = true;
//     return NODE
// }
};

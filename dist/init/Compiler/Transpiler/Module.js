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
const utils_1 = require("../../../Helpers/utils");
const utils_2 = require("./utils");
const amdBodyVisitor_1 = require("./amdBodyVisitor");
// console.log("🚀 ---> file: Module.js ---> line 16 ---> TransformFlags", TransformFlags)
const { ContainsDynamicImport } = typescript_1.TransformFlags;
const { createStringLiteral, createCallExpression, createUniqueName, createExpressionStatement, createParenthesizedExpression, createReturnStatement, createIdentifier } = typescript_1.factory;
const { CREATE_Export_File_Function, CREATE_Plus_Token_Nodes, CREATE_Const_Variable, CREATE_Property_Access_Expression, CREATE_Equals_Token_Nodes, CREATE_Object_Binding_Pattern, CREATE_CAll_Function, CREATE_Assign_Polyfil, CREATE_Property_Access_Equals_Token, CREATE_Object_WiTH_String_Keys } = createFactoryCode_1.generateFactory;
// defaultModulePaths
// const watcher = chokidar.watch([]);
// let STATEMENTS = []
// let stateNode = CREATE_Call_Function(STATEMENTS)
// let UNICNAME = ts.createUniqueName('AAA')
// let incremm = 0
exports.visited_SourceFiles = new Map();
exports.ModuleTransformersBefore = {
    [typescript_1.SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
        // console.log("🚀 --> file: Module.js --> line 58 --> CTX", CTX);
        // if (NODE.before_visited) return NODE
        const visited_NODE = exports.visited_SourceFiles.get(NODE.originalFileName);
        // const visited_NODE = FilesThree.get(NODE.path)
        if (visited_NODE) {
            return visited_NODE;
        }
        // console.log("🚀 --> file: Module.js --> line 65 --> NODE.originalFileName", visited_SourceFiles.keys(), NODE.originalFileName, ++incremm);
        // console.log("🚀 --> file: Module.js --> line 60 --> NODE.before_visited", NODE.before_visited);
        const compilerOptions = CTX.getCompilerOptions();
        const moduleInfo = (0, utils_2.getOrSetModuleInfo)(NODE.originalFileName, compilerOptions);
        CTX.ModuleColection = (0, utils_2.configModules)(NODE, moduleInfo, compilerOptions);
        if (!moduleInfo.isNodeModule && !moduleInfo.fileWatcher) {
            (0, utils_2.watchModuleFileChange)(NODE, moduleInfo, compilerOptions);
        }
        try {
            if (typescript_1.default.isJsonSourceFile(NODE)) {
                NODE = typescript_1.default.updateSourceFileNode(NODE, [createExpressionStatement(CREATE_Property_Access_Equals_Token(CREATE_Object_WiTH_String_Keys([
                        [createIdentifier("default"), ...NODE.statements]
                    ]), [compilerOptions.__Import_Module_Name, (0, utils_1.getColumnName)(moduleInfo.Module_INDEX)]))]);
                NODE.scriptKind = typescript_1.ScriptKind.Unknown;
            }
            else {
                console.log("🚀 --> file: Module.js --> line 63 --> NODE.originalFileName", [NODE.originalFileName]);
                NODE = typescript_1.default.updateSourceFileNode(NODE, [
                    createExpressionStatement(CREATE_Export_File_Function(NODE.statements.flatMap((statementNode) => (0, amdBodyVisitor_1.topLevelVisitor)(statementNode, NODE, CTX)), compilerOptions.__Import_Module_Name, moduleInfo.Module_INDEX))
                ]);
            }
            NODE.externalModuleIndicator = undefined;
        }
        catch (error) {
            console.log(error);
        }
        NODE = (0, typescript_1.visitEachChild)(NODE, visitor, CTX);
        // NODE.before_visited = true;
        exports.visited_SourceFiles.set(NODE.originalFileName, NODE);
        // setFileinThree.set(NODE.originalFileName, NODE)
        // App.__Host.setFileinThree(NODE.originalFileName.toLowerCase(), NODE)
        // .set(NODE.originalFileName)
        // FilesThree.set(NODE.path, NODE)
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
//# sourceMappingURL=Module.js.map
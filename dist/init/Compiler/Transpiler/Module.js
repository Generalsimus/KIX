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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleTransformersAfter = exports.ModuleTransformersBefore = void 0;
const typescript_1 = __importStar(require("typescript"));
const createFactoryCode_1 = require("./createFactoryCode");
const chokidar_1 = __importDefault(require("chokidar"));
const utils_1 = require("../../../Helpers/utils");
const utils_2 = require("./utils");
const amdBodyVisitor_1 = require("./amdBodyVisitor");
// console.log("🚀 ---> file: Module.js ---> line 16 ---> TransformFlags", TransformFlags)
const { ContainsDynamicImport } = typescript_1.TransformFlags;
const { createStringLiteral, createCallExpression, createUniqueName, createExpressionStatement, createParenthesizedExpression, createReturnStatement, createIdentifier } = typescript_1.factory;
const { CREATE_Export_File_Function, CREATE_Plus_Token_Nodes, CREATE_Const_Variable, CREATE_Property_Access_Expression, CREATE_Equals_Token_Nodes, CREATE_Object_Binding_Pattern, CREATE_CAll_Function, CREATE_Assign_Polyfil, CREATE_Property_Access_Equals_Token, CREATE_Object_WiTH_String_Keys } = createFactoryCode_1.generateFactory;
const watcher = chokidar_1.default.watch([]);
// let STATEMENTS = []
// let stateNode = CREATE_Call_Function(STATEMENTS)
// let UNICNAME = ts.createUniqueName('AAA')
exports.ModuleTransformersBefore = {
    // [SyntaxKind.ExportAssignment]: (Node) => {  
    // }, 
    // [SyntaxKind.ArrowFunction]: (NODE, visitor, CTX) => { 
    //     // return visitEachChild(NODE, visitor, CTX)
    // },
    [typescript_1.SyntaxKind.ImportDeclaration]: (NODE, visitor, CTX) => {
        // return visitEachChild(NODE, visitor, CTX)
    },
    [typescript_1.SyntaxKind.ExportKeyword]: (NODE, visitor, CTX) => {
        // delete NODE.parent 
        // console.log("🚀 --> file: Module.js --> line 65 --> NODE", NODE);
        // console.log("ExportKeyword",NODE)
        //     // return visitEachChild(NODE, visitor, CTX)
    },
    [typescript_1.SyntaxKind.ExportDeclaration]: (NODE, visitor, CTX) => {
        // delete NODE.parent 
        // console.log("ExportKeyword",NODE)
        //     // return visitEachChild(NODE, visitor, CTX)
    },
    // [SyntaxKind.ImportKeyword]: (NODE, visitor, CTX) => {
    //     //     console.log("🚀 ---> file: transpilers.js ---> line 31 ---> CTX",)
    //     if (NODE.parent.arguments) {
    //         NODE.parent.arguments[0] = CREATE_Plus_Token_Nodes([createStringLiteral(CTX.getCompilerOptions().__Url_Dir_Path), NODE.parent.arguments[0]])
    //     }
    //     return ts.createIdentifier("ASYNC_IMPORT_POLYFIL")
    // },
    // [SyntaxKind.RequireKeyword]: (NODE, visitor, CTX) => {
    //     return ts.createIdentifier("ssssssssssssss")
    // },
    [typescript_1.SyntaxKind.ExportAssignment]: (NODE, visitor, CTX) => {
        // delete NODE.parent
        // console.log("🚀 --> file: Module.js --> line 89 --> NODE.parent", NODE.parent); 
        // console.log("🚀 --> file: Module.js --> line 88 --> NODE", NODE); 
    },
    [typescript_1.SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
        console.log("🚀 --> file: Module.js --> line 97 --> CTX", CTX.startLexicalEnvironment);
        if (NODE.before_visited)
            return NODE;
        const compilerOptions = CTX.getCompilerOptions();
        const moduleInfo = (0, utils_2.getOrSetModuleInfo)(NODE.originalFileName);
        if (!moduleInfo.isNodeModule) {
            chokidar_1.default.watch(NODE.originalFileName).on('change', (event, path) => {
                console.log("chokidar___", event, path);
            });
        }
        CTX.ModuleColection = (0, utils_2.configModules)(NODE, moduleInfo, compilerOptions);
        NODE.statements = NODE.statements.flatMap((node) => (0, amdBodyVisitor_1.topLevelVisitor)(node, CTX));
        // collectExternalModuleInfo
        try {
            if (typescript_1.default.isJsonSourceFile(NODE)) {
                NODE.scriptKind = typescript_1.ScriptKind.Unknown;
                NEWSTATEMENT.push(createExpressionStatement(CREATE_Property_Access_Equals_Token(CREATE_Object_WiTH_String_Keys([
                    [createIdentifier("default"), NODE.statements[0].expression]
                ]), [compilerOptions.__Import_Module_Name, (0, utils_1.getColumnName)(moduleInfo.Module_INDEX)])));
            }
            else {
                NEWSTATEMENT.push(createExpressionStatement(CREATE_Export_File_Function(NODE.statements, compilerOptions.__Import_Module_Name, moduleInfo.Module_INDEX)));
            }
            NODE.statements = NEWSTATEMENT;
            NODE.externalModuleIndicator = undefined;
        }
        catch (error) {
            console.log(error);
        }
        NODE.before_visited = true;
        return (0, typescript_1.visitEachChild)(NODE, visitor, CTX);
    }
};
exports.ModuleTransformersAfter = {
    [typescript_1.SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
        if (NODE.After_visited)
            return NODE;
        NODE.After_visited = true;
        return NODE;
    }
};
//# sourceMappingURL=Module.js.map
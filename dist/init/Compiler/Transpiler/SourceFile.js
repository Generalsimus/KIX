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
exports.transpilerAfter = exports.transpilerBefore = void 0;
const typescript_1 = __importStar(require("typescript"));
const createFactoryCode_1 = require("./createFactoryCode");
const chokidar_1 = __importDefault(require("chokidar"));
const utils_1 = require("../../../Helpers/utils");
const utils_2 = require("./utils");
const { createStringLiteral } = typescript_1.factory;
const { CREATE_Export_File_Function, CREATE_Plus_Token_Nodes, CREATE_Const_Variable, CREATE_Property_Access_Expression } = createFactoryCode_1.generateFactory;
const watcher = chokidar_1.default.watch([]);
// let STATEMENTS = []
// let stateNode = CREATE_Call_Function(STATEMENTS)
// let UNICNAME = ts.createUniqueName('AAA')
exports.transpilerBefore = {
    // [SyntaxKind.ExportAssignment]: (Node) => {  
    // }, 
    // [SyntaxKind.ArrowFunction]: (NODE, visitor, CTX) => { 
    //     // return visitEachChild(NODE, visitor, CTX)
    // },
    [typescript_1.SyntaxKind.ImportKeyword]: (NODE, visitor, CTX) => {
        //     console.log("🚀 ---> file: transpilers.js ---> line 31 ---> CTX",)
        if (NODE.parent.arguments) {
            NODE.parent.arguments[0] = CREATE_Plus_Token_Nodes([createStringLiteral(CTX.getCompilerOptions().__Url_Dir_Path), NODE.parent.arguments[0]]);
        }
        return typescript_1.default.createIdentifier("ASYNC_IMPORT_POLYFIL");
    },
    [typescript_1.SyntaxKind.RequireKeyword]: (NODE, visitor, CTX) => {
        return typescript_1.default.createIdentifier("ssssssssssssss");
    },
    // [SyntaxKind.CallExpression]: (NODE, visitor, CTX) => {
    //     return ts.createIdentifier("ssssssssssssss")
    // },
    // [SyntaxKind.ExportAssignment]: (NODE, visitor, CTX) => { 
    //     // return visitEachChild(NODE, visitor, CTX)
    // },
    [typescript_1.SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
        if (NODE.before_visited)
            return NODE;
        // scriptKind
        const compilerOptions = CTX.getCompilerOptions();
        const ModuleColection = (0, utils_2.configModules)(NODE, compilerOptions);
        if (NODE.imports.length) {
            const { externalImports } = (0, typescript_1.collectExternalModuleInfo)(CTX, NODE, CTX.getEmitResolver(), compilerOptions);
            externalImports.length && NODE.statements.splice(0, 0, CREATE_Const_Variable(externalImports.map((importNode) => {
                const { Module_INDEX } = ModuleColection[importNode.moduleSpecifier.text];
                return [
                    (0, typescript_1.getLocalNameForExternalImport)(typescript_1.factory, importNode, NODE),
                    CREATE_Property_Access_Expression([compilerOptions.__Import_Module_Name, (0, utils_1.getColumnName)(Module_INDEX)])
                ];
            })));
        }
        NODE.before_visited = true;
        return (0, typescript_1.visitEachChild)(NODE, visitor, CTX);
    }
};
exports.transpilerAfter = {
    [typescript_1.SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
        // throw new Error("ss")
        // console.log("🚀 ---> file: transpilers.js ---> line 31 ---> CTX",NODE)
        if (NODE.After_visited)
            return NODE;
        const moduleInfo = utils_2.ModulesThree.get(NODE.originalFileName);
        if (moduleInfo.KindName === "ImportKeyword") {
            // სინქქრონული მოდულის იმპორტი
            // NODE.statements = []
        }
        try {
            const newStatements = NODE.statements[0].expression.arguments.pop().body.statements;
            NODE.statements = [CREATE_Export_File_Function(newStatements, moduleInfo.Module_INDEX, CTX.getCompilerOptions().__Import_Module_Name)];
        }
        catch (error) {
        }
        NODE.After_visited = true;
        return NODE;
    }
};
//# sourceMappingURL=SourceFile.js.map
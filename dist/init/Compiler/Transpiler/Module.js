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
const utils_1 = require("./utils");
const App_1 = require("../../App");
const utils_2 = require("../../../helpers/utils");
const path_1 = __importDefault(require("path"));
exports.ModuleTransformersBefore = {
    [typescript_1.SyntaxKind.ExportKeyword]: (NODE, visitor, CTX) => {
    },
    [typescript_1.SyntaxKind.ImportKeyword]: (NODE, visitor, CTX) => {
        if (NODE.parent && NODE.parent.arguments?.["0"]?.text) {
            const moduleInfo = CTX.ModuleColection[NODE.parent.arguments["0"].text];
            const compilerOptions = CTX.getCompilerOptions();
            if (moduleInfo) {
                NODE.parent.arguments = [
                    typescript_1.default.createStringLiteral((0, utils_2.filePathToUrl)(path_1.default.relative(App_1.App.__RunDirName, moduleInfo.modulePath)))
                ];
                return typescript_1.factory.createElementAccessExpression(typescript_1.factory.createIdentifier(compilerOptions.__Import_Module_Name), typescript_1.factory.createStringLiteral(moduleInfo.moduleIndex + "a"));
            }
        }
        return typescript_1.factory.createIdentifier("import");
    },
    [typescript_1.SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
        const compilerOptions = CTX.getCompilerOptions();
        const moduleInfo = compilerOptions.__moduleThree.get(NODE.originalFileName);
        CTX.ModuleColection = moduleInfo.moduleColection;
        const isNodeModuleOrNodeCompiler = moduleInfo.isNodeModule && !compilerOptions.__isNodeModuleBuilding;
        if (isNodeModuleOrNodeCompiler || (moduleInfo.isAsyncModule)) {
            NODE = typescript_1.default.updateSourceFileNode(NODE, []);
            NODE.externalModuleIndicator = undefined;
            createFactoryCode_1.generateFactory.CREATE_Async_Module_SourceFile_IF_NEEDED(NODE, moduleInfo, compilerOptions);
            return NODE;
        }
        const visitedSourceFile = compilerOptions.__visitedSourceFilesMap.get(NODE.originalFileName);
        if (visitedSourceFile) {
            CTX.Module_GET_POLYFIL = (CTX.Module_GET_POLYFIL || visitedSourceFile.Module_GET_POLYFIL);
            return visitedSourceFile;
        }
        try {
            if (typescript_1.default.isJsonSourceFile(NODE)) {
                NODE = createFactoryCode_1.generateFactory.CREATE_JSON_SourceFile(NODE, moduleInfo, compilerOptions);
            }
            else {
                NODE = createFactoryCode_1.generateFactory.CREATE_IMPORT_JS_SourceFile(NODE, CTX, moduleInfo, compilerOptions);
            }
        }
        catch (error) {
            console.log(error);
        }
        createFactoryCode_1.generateFactory.CREATE_Async_Module_SourceFile_IF_NEEDED(NODE, moduleInfo, compilerOptions);
        (0, utils_1.watchModuleFileChange)(NODE, moduleInfo, compilerOptions);
        NODE.externalModuleIndicator = undefined;
        createFactoryCode_1.generateFactory.CREATE_SourceFile_Polyfill_IF_NEEDED(NODE, CTX, compilerOptions);
        NODE = (0, typescript_1.visitEachChild)(NODE, visitor, CTX);
        compilerOptions.__visitedSourceFilesMap.set(NODE.originalFileName, NODE);
        return NODE;
    }
};
exports.ModuleTransformersAfter = {
    [typescript_1.SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
        return NODE;
    }
};

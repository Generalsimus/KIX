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
exports.ModuleTransformersAfter = exports.ModuleTransformersBefore = exports.visitedSourceFilesMap = void 0;
const typescript_1 = __importStar(require("typescript"));
const createFactoryCode_1 = require("./createFactoryCode");
const utils_1 = require("./utils");
const amdBodyVisitor_1 = require("./amdBodyVisitor");
const App_1 = require("../../App");
const utils_2 = require("../../../helpers/utils");
const path_1 = __importDefault(require("path"));
exports.visitedSourceFilesMap = new Map();
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
        const moduleInfo = compilerOptions.moduleThree.get(NODE.originalFileName);
        CTX.ModuleColection = moduleInfo.moduleColection;
        if (moduleInfo.isNodeModule && !compilerOptions.__isNodeModuleBuilding) {
            NODE = typescript_1.default.updateSourceFileNode(NODE, []);
            NODE.externalModuleIndicator = undefined;
            return NODE;
        }
        const visitedSourceFile = exports.visitedSourceFilesMap.get(NODE.originalFileName);
        if (visitedSourceFile) {
            CTX.Module_GET_POLYFIL = (CTX.Module_GET_POLYFIL || visitedSourceFile.Module_GET_POLYFIL);
            return visitedSourceFile;
        }
        if (moduleInfo.isAsyncModule) {
            NODE = createFactoryCode_1.generateFactory.CREATE_Async_Module_SourceFile(NODE, moduleInfo, compilerOptions);
        }
        else {
            try {
                if (typescript_1.default.isJsonSourceFile(NODE)) {
                    NODE = typescript_1.default.updateSourceFileNode(NODE, [
                        typescript_1.factory.createExpressionStatement(createFactoryCode_1.generateFactory.CREATE_Export_File_Function(NODE.statements.map((node) => {
                            return typescript_1.factory.createExpressionStatement(createFactoryCode_1.generateFactory.CREATE_Equals_Token_Nodes([
                                createFactoryCode_1.generateFactory.CREATE_Property_Access_Expression(["exports", "default"]),
                                node.expression
                            ]));
                        }), compilerOptions.__Import_Module_Name, moduleInfo.moduleIndex))
                    ]);
                    NODE.scriptKind = typescript_1.ScriptKind.Unknown;
                }
                else {
                    NODE = typescript_1.default.updateSourceFileNode(NODE, [
                        typescript_1.factory.createExpressionStatement(createFactoryCode_1.generateFactory.CREATE_Export_File_Function(NODE.statements.flatMap((statementNode) => (0, amdBodyVisitor_1.topLevelVisitor)(statementNode, NODE, CTX)), compilerOptions.__Import_Module_Name, moduleInfo.moduleIndex))
                    ]);
                    if (NODE.isCSSFile) {
                        NODE.fileName = NODE.fileName + ".json";
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        if ((!moduleInfo.fileWatcher && App_1.App.__Dev_Mode && !compilerOptions.__isNodeModuleBuilding) &&
            (!moduleInfo.isAsyncModule || (moduleInfo.isAsyncModule && !moduleInfo.isEs6Module))) {
            (0, utils_1.watchModuleFileChange)(NODE, moduleInfo, compilerOptions);
        }
        NODE.externalModuleIndicator = undefined;
        if (!CTX.Module_GET_POLYFIL) {
            NODE.statements.splice(0, 0, (CTX.Module_GET_POLYFIL =
                (NODE.Module_GET_POLYFIL =
                    createFactoryCode_1.generateFactory.CREATE_Module_GET_POLYFIL(compilerOptions.__Import_Module_Name))));
        }
        NODE = (0, typescript_1.visitEachChild)(NODE, visitor, CTX);
        exports.visitedSourceFilesMap.set(NODE.originalFileName, NODE);
        return NODE;
    }
};
exports.ModuleTransformersAfter = {
    [typescript_1.SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
        return NODE;
    }
};

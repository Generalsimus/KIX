"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompileFile = exports.__compiledFilesThreshold = void 0;
const App_1 = require("../App");
const typescript_1 = require("typescript");
const path_1 = __importDefault(require("path"));
const utils_1 = require("../../helpers/utils");
const Module_1 = require("./Transpiler/Module");
const utils_2 = require("./Transpiler/utils");
const NodeModules_1 = require("./Transpiler/NodeModules");
const index_1 = require("./Transpiler/JSX/index");
const loger_1 = require("../../helpers/loger");
const { __Host, __RunDirName, __ModuleUrlPath, __requestsThreshold } = App_1.App;
const { resetFilesThree } = __Host;
exports.__compiledFilesThreshold = new Map();
const CompileFile = (FilePath, HTMLFilePaths, __compilerOptions, priorityCompilerOptions = {}) => {
    let resetModules = true;
    let oldProgram;
    const __Import_Module_Name = (0, utils_1.getImportModuleName)(), __Module_Window_Name = (0, utils_1.getModuleWindowName)(), compilingModuleInfo = {
        moduleIndex: utils_2.startModulesIndex++,
        modulePath: FilePath,
        isNodeModule: false,
        __Module_Window_Name,
        moduleColection: {},
        isAsyncModule: false,
    }, moduleThree = new Map([
        ...utils_2.defaultModuleThree,
        [FilePath, compilingModuleInfo]
    ]), requestPath = (0, utils_1.filePathToUrl)(__compilerOptions.outFile), mapRequestPath = requestPath + ".map", changeFileCallback = () => {
        (0, loger_1.clareLog)({
            "Compiling...": "white"
        });
        compilerOptions.cancellationToken = (0, utils_1.createCancellationToken)();
        oldProgram = (0, typescript_1.createProgram)([FilePath], compilerOptions, host, oldProgram);
        exports.__compiledFilesThreshold.set(FilePath, oldProgram);
        oldProgram.emit(undefined, writeFileCallback, undefined, undefined, transformers);
        compilerOptions.resetNodeModuleFilesFunc();
    }, compilerOptions = {
        ...__compilerOptions,
        inlineSources: true,
        watch: true,
        moduleThree,
        __Module_Window_Name,
        rootDir: __RunDirName,
        __Import_Module_Name,
        changeFileCallback,
        resetModuleFiles: () => {
            resetModules = true;
        },
        visitedSourceFilesMap: new Map(),
        resetNodeModuleFilesFunc: () => {
            if (resetModules) {
                const Modules = new Set([utils_2.codeControlerPath, utils_2.codePolyfillPath]);
                for (const ModuleFilePath of HTMLFilePaths) {
                    (0, utils_1.getModuleFiles)(compilerOptions.moduleThree.get(ModuleFilePath), Modules);
                }
                resetModules = false;
                Compile_Node_Modules([...Modules], compilerOptions);
            }
            resetFilesThree(oldProgram.getFilesByNameMap());
        },
        __Url_Dir_Path: path_1.default.dirname(requestPath),
        ...priorityCompilerOptions
    }, host = (0, utils_2.useLocalFileHostModuleRegistrator)(__Host, compilerOptions), transformers = (0, utils_2.getTransformersObject)([Module_1.ModuleTransformersBefore, index_1.JSXTransformersBefore], [Module_1.ModuleTransformersAfter]), writeFileCallback = (fileName, content) => {
        const ext = path_1.default.extname(fileName);
        if (ext === ".map") {
            __requestsThreshold.set(mapRequestPath, content);
        }
        else if (ext === ".js") {
            const Module_Text = `(function(${__Import_Module_Name}){${content} \n ${__Import_Module_Name}[${compilingModuleInfo.moduleIndex}];\n})(window.${__Module_Window_Name}={})${compilerOptions.sourceMap ? `\n//# sourceMappingURL=${mapRequestPath}` : ""}`;
            __requestsThreshold.set(requestPath, Module_Text);
        }
    };
    changeFileCallback();
};
exports.CompileFile = CompileFile;
const Compile_Node_Modules = (NodeModuelsPaths, defaultcompilerOptions) => {
    let Node_oldProgram;
    const transformers = (0, utils_2.getTransformersObject)([Module_1.ModuleTransformersBefore, NodeModules_1.NodeModuleTransformersBefore], [Module_1.ModuleTransformersAfter]), __Module_Window_Name = defaultcompilerOptions.__Node_Module_Window_Name, compilerOptions = {
        ...defaultcompilerOptions,
        outFile: __ModuleUrlPath,
        moduleThree: utils_2.nodeModuleThree,
        visitedSourceFilesMap: new Map(),
        lib: undefined,
        sourceMap: false,
        __isNodeModuleBuilding: true,
        __Import_Module_Name: __Module_Window_Name,
        __Module_Window_Name,
        resetModuleFiles: () => { },
    }, executeCodeControler = App_1.App.__Dev_Mode ? `${compilerOptions.__Import_Module_Name}[${utils_2.codeControlerIndex}]` : "";
    Node_oldProgram = (0, typescript_1.createProgram)(NodeModuelsPaths, compilerOptions, (0, utils_2.useModuleFileHostModuleRegistrator)(__Host, compilerOptions), Node_oldProgram);
    Node_oldProgram.emit(undefined, (fileName, content) => {
        if (path_1.default.extname(fileName) == ".js") {
            __requestsThreshold.set(__ModuleUrlPath, `(function(${compilerOptions.__Import_Module_Name}){${content}\n${executeCodeControler}\n})((window.${__Module_Window_Name}={}))`);
        }
    }, undefined, undefined, transformers);
};

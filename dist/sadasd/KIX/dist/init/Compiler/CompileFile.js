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
const resolve_1 = __importDefault(require("resolve"));
const utils_2 = require("./Transpiler/utils");
const NodeModules_1 = require("./Transpiler/NodeModules");
const index_1 = require("./Transpiler/JSX/index");
const loger_1 = require("../../helpers/loger");
const { __Host, __RunDirName, __ModuleUrlPath, __requestsThreshold } = App_1.App;
const { resetFilesThree } = __Host;
exports.__compiledFilesThreshold = new Map();
const CompileFile = (FilePath, HTMLFilePaths, __compilerOptions) => {
    let resetModules = true;
    let oldProgram;
    const __Import_Module_Name = (0, utils_1.getImportModuleName)(), __Module_Window_Name = (0, utils_1.getModuleWindowName)(), requestPath = (0, utils_1.filePathToUrl)(__compilerOptions.outFile), mapRequestPath = requestPath + ".map", changeFileCallback = () => {
        (0, loger_1.clareLog)({
            "Generating browser application bundles...": "yellow"
        });
        compilerOptions.cancellationToken = (0, utils_1.createCancellationToken)();
        oldProgram = (0, typescript_1.createProgram)(compilerOptions.rootNames, compilerOptions, __Host, oldProgram);
        exports.__compiledFilesThreshold.set(FilePath, oldProgram);
        oldProgram.emit(undefined, writeFileCallback, undefined, undefined, transformers);
        if (resetModules) {
            const Modules = new Set(defaultModules);
            for (const ModuleFilePath of HTMLFilePaths) {
                ModuleFilePath && (0, utils_1.getModuleFiles)(utils_2.ModulesThree.get(ModuleFilePath), Modules);
            }
            resetModules = false;
            Compile_Node_Modules([...Modules], compilerOptions);
        }
        resetFilesThree(oldProgram.getFilesByNameMap());
    }, compilerOptions = Object.assign(Object.assign({}, __compilerOptions), { inlineSources: true, watch: true, __Module_Window_Name, rootDir: __RunDirName, rootNames: [FilePath], __Import_Module_Name,
        changeFileCallback, resetModuleFiles: () => {
            resetModules = true;
        }, __Url_Dir_Path: path_1.default.dirname(requestPath) }), transformers = (0, utils_2.getTransformersObject)([Module_1.ModuleTransformersBefore, index_1.JSXTransformersBefore], [Module_1.ModuleTransformersAfter]), defaultModules = [
        App_1.App.__kixModuleLocation || App_1.App.__kixLocalLocation,
        (0, typescript_1.normalizeSlashes)(path_1.default.join(__dirname, "./../../../main/codeController/index.js"))
    ], writeFileCallback = (fileName, content) => {
        const ext = path_1.default.extname(fileName);
        if (ext === ".map") {
            __requestsThreshold.set(mapRequestPath, content);
        }
        else if (ext === ".js") {
            const Module_Text = `(function(${__Import_Module_Name}){${content} \n return ${__Import_Module_Name}; })(window.${__Module_Window_Name}={})\n//# sourceMappingURL=${mapRequestPath}`;
            __requestsThreshold.set(requestPath, Module_Text);
        }
    };
    changeFileCallback();
};
exports.CompileFile = CompileFile;
const Compile_Node_Modules = (NodeModuelsPaths, defaultcompilerOptions) => {
    let Node_oldProgram;
    const transformers = (0, utils_2.getTransformersObject)([Module_1.ModuleTransformersBefore, NodeModules_1.NodeModuleTransformersBefore], [Module_1.ModuleTransformersAfter]), __Module_Window_Name = defaultcompilerOptions.__Node_Module_Window_Name;
    const compilerOptions = Object.assign(Object.assign({}, defaultcompilerOptions), { outFile: __ModuleUrlPath, lib: undefined, sourceMap: false, rootNames: NodeModuelsPaths, __Import_Module_Name: __Module_Window_Name, __Module_Window_Name, resetModuleFiles: () => { } });
    Node_oldProgram = (0, typescript_1.createProgram)(NodeModuelsPaths, compilerOptions, Object.assign(Object.assign({}, __Host), { resolveModuleNames: (moduleNames, containingFile, reusedNames, redirectedReference) => {
            return moduleNames.map((ModuleText) => {
                try {
                    const modulePath = resolve_1.default.sync(ModuleText, {
                        basedir: path_1.default.dirname(containingFile),
                        extensions: ['.js', '.ts'],
                    });
                    return {
                        resolvedFileName: (0, typescript_1.normalizeSlashes)(modulePath),
                        originalPath: undefined,
                        extension: path_1.default.extname(modulePath),
                        isExternalLibraryImport: false,
                        packageId: undefined
                    };
                }
                catch (e) {
                    return undefined;
                }
            });
        } }), Node_oldProgram);
    Node_oldProgram.emit(undefined, (fileName, content) => {
        if (path_1.default.extname(fileName) == ".js") {
            __requestsThreshold.set(__ModuleUrlPath, `(function(${compilerOptions.__Import_Module_Name}){${content} \n return ${compilerOptions.__Import_Module_Name};})((window.${__Module_Window_Name}={}))`);
        }
    }, undefined, undefined, transformers);
};

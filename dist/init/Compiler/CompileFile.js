"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compile_Node_Modules = exports.CompileFile = void 0;
const App_1 = require("../App");
const typescript_1 = require("typescript");
const posix_1 = __importDefault(require("path/posix"));
const utils_1 = require("../../Helpers/utils");
const Module_1 = require("./Transpiler/Module");
const resolve_1 = __importDefault(require("resolve"));
const utils_2 = require("./Transpiler/utils");
const NodeModules_1 = require("./Transpiler/NodeModules");
const CompileModules_1 = require("./CompileModules");
const index_1 = require("./Transpiler/JSX/index");
const { __compilerOptions, __Host, __RunDirName, __ModuleUrlPath, __requestsThreshold } = App_1.App;
const { resetFilesThree } = __Host;
let resetModules = true;
let oldProgram;
const CompileFile = (FilePath, HTMLFilePaths) => {
    const outFile = posix_1.default.relative(__RunDirName, FilePath), __Import_Module_Name = (0, utils_1.getImportModuleName)(), __Module_Window_Name = (0, utils_1.getModuleWindowName)(), REQUEST_PATH = ("./" + outFile).replace(/(^[\.\.\/]+)|(\/+)/g, "/"), MAP_REQUEST_PATH = REQUEST_PATH + ".map";
    const compilerOptions = {
        ...__compilerOptions,
        inlineSources: true,
        outFile,
        __Module_Window_Name,
        rootDir: __RunDirName,
        __Import_Module_Name,
        resetModuleFiles: () => { resetModules = true; },
        __Url_Dir_Path: posix_1.default.dirname(REQUEST_PATH)
    };
    const transformers = (0, utils_2.getTransformersObject)([Module_1.ModuleTransformersBefore, index_1.JSXTransformersBefore], [Module_1.ModuleTransformersAfter]);
    oldProgram = (0, typescript_1.createProgram)([FilePath], compilerOptions, __Host, oldProgram);
    oldProgram.emit(undefined /*sourceFile*/, (fileName, content) => {
        console.log({ fileName, REQUEST_PATH });
        const ext = posix_1.default.extname(fileName);
        if (ext === ".map") {
            __requestsThreshold.set(MAP_REQUEST_PATH, content);
            // console.log(content)
        }
        else if (ext === ".js") {
            const Module_Text = `(function(${__Import_Module_Name}){${content} \n return ${__Import_Module_Name}; })(window.${__Module_Window_Name}={})\n//# sourceMappingURL=${MAP_REQUEST_PATH}`;
            __requestsThreshold.set(REQUEST_PATH, Module_Text);
        }
    }
    // undefined
    /*writeFileCallback*/ , undefined /*cancellationToken*/, undefined /*emitOnlyDtsFiles*/, transformers /*transformers*/);
    const Modules = new Set([(0, utils_2.resolveModule)("kix", __RunDirName)]);
    for (const ModuleFilePath of HTMLFilePaths) {
        (0, utils_1.getModuleFiles)(utils_2.ModulesThree.get(ModuleFilePath), Modules);
    }
    if (resetModules) {
        resetModules = false;
        (0, exports.Compile_Node_Modules)([...Modules], compilerOptions);
    }
    resetFilesThree(oldProgram.getFilesByNameMap());
};
exports.CompileFile = CompileFile;
const Compile_Node_Modules = (NodeModuelsPaths, compilerOptions) => {
    const transformers = (0, utils_2.getTransformersObject)([Module_1.ModuleTransformersBefore, NodeModules_1.NodeModuleTransformersBefore], [Module_1.ModuleTransformersAfter]), __Module_Window_Name = compilerOptions.__Node_Module_Window_Name;
    oldProgram = (0, typescript_1.createProgram)(NodeModuelsPaths, {
        ...compilerOptions,
        outFile: __ModuleUrlPath,
        removeComments: true,
        sourceMap: false,
        __Module_Window_Name,
        resetModuleFiles: () => { },
    }, {
        ...__Host,
        resolveModuleNames: (moduleNames, containingFile, reusedNames, redirectedReference) => {
            // console.log(containingFile)
            return moduleNames.map((ModuleText) => {
                const modulePath = resolve_1.default.sync(ModuleText, {
                    basedir: posix_1.default.dirname(containingFile),
                    extensions: ['.js', '.ts'],
                });
                // console.log(modulePath)
                return {
                    resolvedFileName: modulePath,
                    originalPath: undefined,
                    extension: posix_1.default.extname(modulePath),
                    isExternalLibraryImport: false,
                    packageId: undefined
                };
            });
        }
    }, oldProgram);
    oldProgram.emit(undefined /*sourceFile*/, (fileName, content) => {
        if (posix_1.default.extname(fileName) == ".js") {
            __requestsThreshold.set(__ModuleUrlPath, `(function(${compilerOptions.__Import_Module_Name}){${content} \n return ${compilerOptions.__Import_Module_Name};})((window.${__Module_Window_Name}={}))`);
        }
    }
    // undefined
    /*writeFileCallback*/ , undefined /*cancellationToken*/, undefined /*emitOnlyDtsFiles*/, transformers /*transformers*/);
};
exports.Compile_Node_Modules = Compile_Node_Modules;
//# sourceMappingURL=CompileFile.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompileFile = void 0;
const App_1 = require("../App");
const typescript_1 = require("typescript");
const path_1 = __importDefault(require("path"));
const utils_1 = require("../../Helpers/utils");
const Module_1 = require("./Transpiler/Module");
const resolve_1 = __importDefault(require("resolve"));
const utils_2 = require("./Transpiler/utils");
const NodeModules_1 = require("./Transpiler/NodeModules");
const index_1 = require("./Transpiler/JSX/index");
const { __Host, __RunDirName, __ModuleUrlPath, __requestsThreshold } = App_1.App;
const { resetFilesThree } = __Host;
let increm = 0;
const CompileFile = (FilePath, HTMLFilePaths, __compilerOptions) => {
    let resetModules = true;
    let oldProgram;
    const outFile = path_1.default.relative(__RunDirName, FilePath), __Import_Module_Name = (0, utils_1.getImportModuleName)(), __Module_Window_Name = (0, utils_1.getModuleWindowName)(), REQUEST_PATH = ("./" + outFile).replace(/(^[\.\.\/]+)|(\/+)/g, "/"), MAP_REQUEST_PATH = REQUEST_PATH + ".map", changeFileCallback = () => {
        // console.clear()
        console.log("🚀 --> file: utils.js --> line 69 --> increm", ++increm);
        compilerOptions.cancellationToken = (0, utils_1.createCancellationToken)();
        oldProgram = (0, typescript_1.createProgram)(compilableFilePaths, compilerOptions, __Host, oldProgram);
        oldProgram.emit(undefined /*sourceFile*/, writeFileCallback /*writeFileCallback*/, undefined /*cancellationToken*/, undefined /*emitOnlyDtsFiles*/, transformers /*transformers*/);
        if (resetModules) {
            const Modules = new Set(defaultModules);
            for (const ModuleFilePath of HTMLFilePaths) {
                ModuleFilePath && (0, utils_1.getModuleFiles)(utils_2.ModulesThree.get(ModuleFilePath), Modules);
            }
            resetModules = false;
            Compile_Node_Modules([...Modules], compilerOptions);
        }
        // console.log("🚀 --> file: CompileFile.js --> line 55 --> CompileFile --> oldProgram", oldProgram);
        // console.log("🚀 --> file: CompileFile.js --> line 55 --> CompileFile --> oldProgram", oldProgram.getGlobalDiagnostics());
        resetFilesThree(oldProgram.getFilesByNameMap());
    }, compilerOptions = {
        ...__compilerOptions,
        inlineSources: true,
        watch: true,
        outFile,
        __Module_Window_Name,
        rootDir: __RunDirName,
        __Import_Module_Name,
        changeFileCallback,
        resetModuleFiles: () => {
            resetModules = true;
        },
        __Url_Dir_Path: path_1.default.dirname(REQUEST_PATH)
    }, transformers = (0, utils_2.getTransformersObject)([Module_1.ModuleTransformersBefore, index_1.JSXTransformersBefore], [Module_1.ModuleTransformersAfter]), compilableFilePaths = [FilePath], defaultModules = [
        // resolveModule("kix", __RunDirName),
        (0, typescript_1.normalizeSlashes)(path_1.default.join(__dirname, "./../../main/controler.js"))
    ], writeFileCallback = (fileName, content) => {
        // console.log({ fileName, REQUEST_PATH })
        const ext = path_1.default.extname(fileName);
        if (ext === ".map") {
            __requestsThreshold.set(MAP_REQUEST_PATH, content);
        }
        else if (ext === ".js") {
            const Module_Text = `(function(${__Import_Module_Name}){${content} \n return ${__Import_Module_Name}; })(window.${__Module_Window_Name}={})\n//# sourceMappingURL=${MAP_REQUEST_PATH}`;
            __requestsThreshold.set(REQUEST_PATH, Module_Text);
            console.log(Module_Text);
        }
    };
    console.log("🚀 --> file: CompileFile.js --> line 83 --> CompileFile --> defaultModules", defaultModules);
    // console.log("🚀 --> file: CompileFile.js --> line 97 --> CompileFile --> __dirname", __dirname);
    // console.log("🚀 --> file: CompileFile.js --> line 15 --> __Host", __Host );
    // console.log("🚀 --> file: CompileFile.js --> line 15 --> __Host", __Host.getDefaultLibLocation(compilerOptions));
    changeFileCallback();
};
exports.CompileFile = CompileFile;
const Compile_Node_Modules = (NodeModuelsPaths, compilerOptions) => {
    let Node_oldProgram;
    const transformers = (0, utils_2.getTransformersObject)([Module_1.ModuleTransformersBefore, NodeModules_1.NodeModuleTransformersBefore], [Module_1.ModuleTransformersAfter]), __Module_Window_Name = compilerOptions.__Node_Module_Window_Name;
    Node_oldProgram = (0, typescript_1.createProgram)(NodeModuelsPaths, {
        ...compilerOptions,
        outFile: __ModuleUrlPath,
        removeComments: false,
        lib: undefined,
        sourceMap: false,
        __Module_Window_Name,
        resetModuleFiles: () => { },
    }, {
        ...__Host,
        resolveModuleNames: (moduleNames, containingFile, reusedNames, redirectedReference) => {
            // console.log(containingFile)
            return moduleNames.map((ModuleText) => {
                const modulePath = resolve_1.default.sync(ModuleText, {
                    basedir: path_1.default.dirname(containingFile),
                    extensions: ['.js', '.ts'],
                });
                // console.log(modulePath)
                return {
                    resolvedFileName: modulePath,
                    originalPath: undefined,
                    extension: path_1.default.extname(modulePath),
                    isExternalLibraryImport: false,
                    packageId: undefined
                };
            });
        }
    }, Node_oldProgram);
    Node_oldProgram.emit(undefined /*sourceFile*/, (fileName, content) => {
        if (path_1.default.extname(fileName) == ".js") {
            __requestsThreshold.set(__ModuleUrlPath, `(function(${compilerOptions.__Import_Module_Name}){${content} \n return ${compilerOptions.__Import_Module_Name};})((window.${__Module_Window_Name}={}))`);
            console.log(__ModuleUrlPath, `(function(${compilerOptions.__Import_Module_Name}){${content} \n return ${compilerOptions.__Import_Module_Name};})((window.${__Module_Window_Name}={}))`);
        }
    }
    // undefined
    /*writeFileCallback*/ , undefined /*cancellationToken*/, undefined /*emitOnlyDtsFiles*/, transformers /*transformers*/);
};
//# sourceMappingURL=CompileFile.js.map
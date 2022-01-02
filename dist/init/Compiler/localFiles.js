"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLocalFilesCompiler = void 0;
const App_1 = require("../App");
const CompileFile_1 = require("./CompileFile");
const utils_1 = require("./Transpiler/utils");
const utils_2 = require("../../helpers/utils");
const Module_1 = require("./Transpiler/Module");
const JSX_1 = require("./Transpiler/JSX");
const moduleFiles_1 = require("./moduleFiles");
const initLocalFilesCompiler = (mainFilePath, compilerOptions) => {
    let resetImportedNodeModules = false;
    const __transformers = (0, utils_1.getTransformersObject)([Module_1.ModuleTransformersBefore, JSX_1.JSXTransformersBefore], [Module_1.ModuleTransformersAfter]), __Import_Module_Name = (0, utils_2.getImportModuleName)(), __Module_Window_Name = (0, utils_2.getModuleWindowName)(), requestPath = (0, utils_2.filePathToUrl)(compilerOptions.outFile);
    compilerOptions = {
        ...compilerOptions,
        __Module_Window_Name,
        rootDir: App_1.App.__RunDirName,
        __Import_Module_Name,
        inlineSources: true,
        __transformers,
        __resetModuleFiles: () => {
            resetImportedNodeModules = true;
        },
        __resetNodeModuleFilesFunc: () => {
            if (!resetImportedNodeModules)
                return;
        }
    };
    (0, CompileFile_1.Compiler)([mainFilePath], compilerOptions, {
        __writeFile: (requestPath, content, exeCuteCode, originalCompilerOptions) => {
            if (requestPath === originalCompilerOptions.outFile) {
                content = `(function(${__Import_Module_Name}){${content}\n${exeCuteCode}\n })(window.${__Module_Window_Name}={})\n//# sourceMappingURL=${requestPath + ".map"}`;
            }
            App_1.App.__requestsThreshold.set((0, utils_2.filePathToUrl)(requestPath), content);
            if (!resetImportedNodeModules)
                return;
            const Modules = new Set([utils_1.codeControlerPath, utils_1.codePolyfillPath]);
            (0, utils_2.getModuleFiles)(originalCompilerOptions.__moduleThree.get(mainFilePath), Modules);
            resetImportedNodeModules = false;
            (0, moduleFiles_1.initModuleFileCompiler)([...Modules], compilerOptions);
        }
    });
};
exports.initLocalFilesCompiler = initLocalFilesCompiler;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModuleFileCompiler = void 0;
const App_1 = require("../App");
const CompileFile_1 = require("./CompileFile");
const Module_1 = require("./Transpiler/Module");
const NodeModules_1 = require("./Transpiler/NodeModules");
const utils_1 = require("./Transpiler/utils");
const initModuleFileCompiler = (moduleFiles, compilerOptions) => {
    const __Module_Window_Name = compilerOptions.__Node_Module_Window_Name, __transformers = (0, utils_1.getTransformersObject)([Module_1.ModuleTransformersBefore, NodeModules_1.NodeModuleTransformersBefore], [Module_1.ModuleTransformersAfter]);
    compilerOptions = {
        ...compilerOptions,
        lib: undefined,
        sourceMap: false,
        __transformers,
        outFile: App_1.App.__ModuleUrlPath,
        __isNodeModuleBuilding: true,
        __Import_Module_Name: __Module_Window_Name,
        __Module_Window_Name,
    };
    (0, CompileFile_1.Compiler)(moduleFiles, compilerOptions, {
        __writeFile: (requestPath, content, exeCuteCode, originalCompilerOptions) => {
            if (requestPath === originalCompilerOptions.outFile) {
                content = `(function(${compilerOptions.__Import_Module_Name}){${content}\n${exeCuteCode}\n})((window.${__Module_Window_Name}={}))`;
            }
            App_1.App.__requestsThreshold.set(requestPath, content);
        }
    });
};
exports.initModuleFileCompiler = initModuleFileCompiler;

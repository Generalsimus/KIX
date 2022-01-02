import { App } from "../App";
import { Compiler } from "./CompileFile";
import { ModuleTransformersAfter, ModuleTransformersBefore } from "./Transpiler/Module";
import { NodeModuleTransformersBefore } from "./Transpiler/NodeModules";
import { getTransformersObject } from "./Transpiler/utils";




export const initModuleFileCompiler = (moduleFiles, compilerOptions) => {
    const __Module_Window_Name = compilerOptions.__Node_Module_Window_Name,
        __transformers = getTransformersObject([ModuleTransformersBefore, NodeModuleTransformersBefore], [ModuleTransformersAfter]);
    // __executeCode = App.__Dev_Mode ? `${__Module_Window_Name}[${codeControlerIndex}]` : "",
    // const moduleUrlPath = App.__ModuleUrlPath
    // const moduleUrlWithOutExt = App.__ModuleUrlPath.split(".").slice(0, -1).join(".")
    compilerOptions = {
        ...compilerOptions,
        lib: undefined,
        sourceMap: false,
        __transformers,
        outFile: App.__ModuleUrlPath,
        // __moduleThree: nodeModuleThree,
        __isNodeModuleBuilding: true,
        __Import_Module_Name: __Module_Window_Name,
        __Module_Window_Name,
        // __executeCode
    }
    // const host =;
    //  /* resetNodeModuleFilesFunc */() => { },
    Compiler(
     /* mainFilesPaths */   moduleFiles,
     /* defaultcompilerOptions */    compilerOptions,
     /* priorityCompilerOptions */     {
            __writeFile: (requestPath, content, exeCuteCode, originalCompilerOptions) => {
                if (requestPath === originalCompilerOptions.outFile) {

                    const Module_Text = `(function(${compilerOptions.__Import_Module_Name}){${content}\n${exeCuteCode}\n})((window.${__Module_Window_Name}={}))`
                    App.__requestsThreshold.set(requestPath, Module_Text)
                } else {
                    App.__requestsThreshold.set(requestPath, content)
                }
            }
        },
    )
}



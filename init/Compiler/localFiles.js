import { App } from "../App";
import { Compiler } from "./CompileFile";
import { codeControlerPath, codePolyfillPath, getTransformersObject } from "./Transpiler/utils";
import { filePathToUrl, getImportModuleName, getModuleFiles, getModuleWindowName } from "../../helpers/utils";
import { ModuleTransformersAfter, ModuleTransformersBefore } from "./Transpiler/Module";
import { JSXTransformersBefore } from "./Transpiler/JSX";
import { initModuleFileCompiler } from "./moduleFiles";

export const initLocalFilesCompiler = (mainFilePath, compilerOptions) => {
    // __IndexHtmlMainFilePaths
    let resetImportedNodeModules = false
    const __transformers = getTransformersObject([ModuleTransformersBefore, JSXTransformersBefore], [ModuleTransformersAfter]),
        __Import_Module_Name = getImportModuleName(),
        __Module_Window_Name = getModuleWindowName(),
        requestPath = filePathToUrl(compilerOptions.outFile);
    // mapRequestPath = requestPath + ".map";
    // mainFilePathmoduleIndex = startModulesIndex++,
    // executeCode = `${__Module_Window_Name}[${mainFilePathmoduleIndex}];`;

    compilerOptions = {
        ...compilerOptions,
        __Module_Window_Name,
        rootDir: App.__RunDirName,
        // rootNames: [FilePath],
        // buildPath: FilePath,
        __Import_Module_Name,
        // __moduleThree,
        // __getLocalModuleThree,
        inlineSources: true,
        __transformers,
        __resetModuleFiles: () => {
            resetImportedNodeModules = true
        },
        __resetNodeModuleFilesFunc: () => {
            if (!resetImportedNodeModules) return
        }
    }
    Compiler(
        /* mainFilesPaths */[mainFilePath],
        /* defaultcompilerOptions */    compilerOptions,
        /* priorityCompilerOptions */     {
            __writeFile: (requestPath, content, exeCuteCode, originalCompilerOptions) => {
                if (requestPath === originalCompilerOptions.outFile) {
                    content = `(function(${__Import_Module_Name}){${content}\n${exeCuteCode}\n })(window.${__Module_Window_Name}={})\n//# sourceMappingURL=${requestPath + ".map"}`
                }
                //     App.__requestsThreshold.set(filePathToUrl(requestPath), Module_Text)
                // } else {
                // }

                App.__requestsThreshold.set(filePathToUrl(requestPath), content)

                if (!resetImportedNodeModules) return
                const Modules = new Set([codeControlerPath, codePolyfillPath])
                getModuleFiles(originalCompilerOptions.__moduleThree.get(mainFilePath), Modules)
                resetImportedNodeModules = false;
                initModuleFileCompiler(
                    [...Modules],
                    compilerOptions
                )

            }
        },

    )
}


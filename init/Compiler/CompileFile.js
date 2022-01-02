import { App } from "../App"
import { createProgram, createSolutionBuilderWithWatchHost, normalizeSlashes } from "typescript"
import path from "path"
import { createCancellationToken, filePathToUrl, getImportModuleName, getModuleFiles, getModuleWindowName } from "../../helpers/utils"
import { ModuleTransformersAfter, ModuleTransformersBefore } from "./Transpiler/Module"
import { codeControlerIndex, configCompilerOptions, defaultModuleThree, getTransformersObject, nodeModuleThree, startModulesIndex, useLocalFileHostModuleRegistrator, useModuleFileHostModuleRegistrator } from "./Transpiler/utils"
import { NodeModuleTransformersBefore } from "./Transpiler/NodeModules"
import { JSXTransformersBefore } from "./Transpiler/JSX/index"
import { clareLog } from "../../helpers/loger"


const { __Host, __RunDirName, __ModuleUrlPath, __requestsThreshold } = App
const { resetFilesThree } = __Host





export const __compiledFilesThreshold = new Map();
export const Compiler = (
    __mainFilesPaths,
    // __resetNodeModuleFilesFunc = () => { },
    defaultcompilerOptions = {},
    priorityCompilerOptions = {},
) => {

    const compilerOptions = {
        ...defaultcompilerOptions,
        __visitedSourceFilesMap: new Map(),
        __mainFilesPaths,
        ...priorityCompilerOptions,
    };
    configCompilerOptions(compilerOptions)


    const __emitProgram = compilerOptions.__emitProgram = () => {
        clareLog({
            "Compiling...": "white"
        })

        compilerOptions.cancellationToken = createCancellationToken();


         (compilerOptions.__oldProgram = createProgram(
            __mainFilesPaths,
            compilerOptions,
            compilerOptions.__Host,
            compilerOptions.__oldProgram
        )).emit(
            undefined /*sourceFile*/,
            compilerOptions.writeFile /*writeFileCallback*/,
            undefined /*cancellationToken*/,
            undefined /*emitOnlyDtsFiles*/,
            compilerOptions.__transformers /*transformers*/
        )

        // compilerOptions.resetNodeModuleFilesFunc()

        for (const mainFilesPath of __mainFilesPaths) {
            __compiledFilesThreshold.set(mainFilesPath, compilerOptions.__oldProgram)
        }
    };
    __emitProgram()
    return compilerOptions
}










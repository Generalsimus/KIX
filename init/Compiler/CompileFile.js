import { App } from "../App"
import { createProgram, normalizeSlashes } from "typescript"
import path from "path"
import { createCancellationToken, filePathToUrl, getImportModuleName, getModuleFiles, getModuleWindowName } from "../../helpers/utils"
import { ModuleTransformersAfter, ModuleTransformersBefore } from "./Transpiler/Module"
import resolve from 'resolve'
import { codeControlerIndex, codeControlerPath, codePolyfillPath, defaultModuleThree, getTransformersObject, nodeModuleThree, startModulesIndex, useLocalFileHostModuleRegistrator, useModuleFileHostModuleRegistrator } from "./Transpiler/utils"
import { NodeModuleTransformersBefore } from "./Transpiler/NodeModules"
import { JSXTransformersBefore } from "./Transpiler/JSX/index"
import { clareLog } from "../../helpers/loger"


const { __Host, __RunDirName, __ModuleUrlPath, __requestsThreshold } = App
const { resetFilesThree } = __Host






// let increm = 0;
export const __compiledFilesThreshold = new Map();
export const CompileFile = (FilePath, HTMLFilePaths, __compilerOptions) => {
    // console.log("🚀 --> file: CompileFile.js --> line 28 --> CompileFile --> __compilerOptions", __compilerOptions)

    let resetModules = true;
    let oldProgram;
    const __Import_Module_Name = getImportModuleName(),
        __Module_Window_Name = getModuleWindowName(),
        compilingModuleInfo = {
            moduleIndex: startModulesIndex++,
            modulePath: FilePath,
            isNodeModule: false,
            __Module_Window_Name,
            moduleColection: {},
        },
        moduleThree = new Map([
            ...defaultModuleThree,
            [FilePath, compilingModuleInfo]
        ]),
        requestPath = filePathToUrl(__compilerOptions.outFile),
        mapRequestPath = requestPath + ".map",
        changeFileCallback = () => {
            clareLog({
                "Generating browser application bundles...": "yellow"
            })


            compilerOptions.cancellationToken = createCancellationToken()

            oldProgram = createProgram(
                [FilePath],
                compilerOptions,
                host,
                oldProgram
            );
            __compiledFilesThreshold.set(FilePath, oldProgram)

            // console.log("🚀 --> file: CompileFile.js --> line 49 --> CompileFile --> getProgramDiagnostics(oldProgram)", getProgramDiagnostics(oldProgram))
            oldProgram.emit(
                undefined /*sourceFile*/,
                writeFileCallback /*writeFileCallback*/,
                undefined /*cancellationToken*/,
                undefined /*emitOnlyDtsFiles*/,
                transformers /*transformers*/
            )
            // console.log("🚀 --> file: CompileFile.js --> line 55 --> CompileFile --> getDeclarationDiagnostics", oldProgram.getOptionsDiagnostics());
            if (resetModules) {
                const Modules = new Set([codeControlerPath, codePolyfillPath])


                for (const ModuleFilePath of HTMLFilePaths) {
                    getModuleFiles(compilerOptions.moduleThree.get(ModuleFilePath), Modules)
                }

                resetModules = false
                Compile_Node_Modules(
                    [...Modules],
                    compilerOptions
                )

            }

            resetFilesThree(oldProgram.getFilesByNameMap())
        },
        compilerOptions = {
            ...__compilerOptions,
            inlineSources: true,
            watch: true,
            moduleThree,
            __Module_Window_Name,
            rootDir: __RunDirName,
            // rootNames: [FilePath],
            __Import_Module_Name,
            changeFileCallback,
            resetModuleFiles: () => {
                resetModules = true
            },
            __Url_Dir_Path: path.dirname(requestPath)
        },
        host = useLocalFileHostModuleRegistrator(__Host, compilerOptions),
        transformers = getTransformersObject([ModuleTransformersBefore, JSXTransformersBefore], [ModuleTransformersAfter]),

        writeFileCallback = (fileName, content) => {
            // console.log({ fileName, requestPath })

            const ext = path.extname(fileName)
            if (ext === ".map") {
                __requestsThreshold.set(mapRequestPath, content)
            } else if (ext === ".js") {

                const Module_Text = `(function(${__Import_Module_Name}){${content} \n ${__Import_Module_Name}[${compilingModuleInfo.moduleIndex}];\n})(window.${__Module_Window_Name}={})\n//# sourceMappingURL=${mapRequestPath}`

                __requestsThreshold.set(requestPath, Module_Text)
                // console.log(Module_Text)
                // console.log(Module_Text.length)
            }
        };


    changeFileCallback()






}
































const Compile_Node_Modules = (NodeModuelsPaths, defaultcompilerOptions) => {

    let Node_oldProgram;
    const transformers = getTransformersObject([ModuleTransformersBefore, NodeModuleTransformersBefore], [ModuleTransformersAfter]),
        __Module_Window_Name = defaultcompilerOptions.__Node_Module_Window_Name,
        compilerOptions = {
            ...defaultcompilerOptions,
            outFile: __ModuleUrlPath,
            // removeComments: false, 
            moduleThree: nodeModuleThree,
            lib: undefined,
            sourceMap: false,
            __isNodeModuleBuilding: true,
            // rootNames: NodeModuelsPaths,
            __Import_Module_Name: __Module_Window_Name,
            __Module_Window_Name,
            resetModuleFiles: () => { },
        },
        executeCodeControler = App.__Dev_Mode ? `${compilerOptions.__Import_Module_Name}[${codeControlerIndex}]` : ""
    Node_oldProgram = createProgram(NodeModuelsPaths,
        compilerOptions,
        useModuleFileHostModuleRegistrator(__Host, compilerOptions),
        Node_oldProgram
    );
    Node_oldProgram.emit(
        undefined /*sourceFile*/,
        (fileName, content) => {

            if (path.extname(fileName) == ".js") {
                __requestsThreshold.set(
                    __ModuleUrlPath,
                    `(function(${compilerOptions.__Import_Module_Name}){${content}\n${executeCodeControler}\n})((window.${__Module_Window_Name}={}))`
                )

            }

        }
        // undefined
        /*writeFileCallback*/,
        undefined /*cancellationToken*/,
        undefined /*emitOnlyDtsFiles*/,
        transformers /*transformers*/
    )
}
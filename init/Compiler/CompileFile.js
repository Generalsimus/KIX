import { readSourceFiles } from "./readSourceFiles"
import { App } from "../App"
import ts, { createProgram, getDirectoryPath, getBaseFileName, normalizeSlashes } from "typescript"
import chokidar from "chokidar"
import path from "path/posix"
import { getImportModuleName, getModuleFiles, getModuleWindowName } from "../../Helpers/utils"
import { ModuleTransformersAfter, ModuleTransformersBefore } from "./Transpiler/Module"
import resolve from 'resolve'
import { getTransformersObject, ModulesThree, resolveModule } from "./Transpiler/utils"
import { NodeModuleTransformersBefore } from "./Transpiler/NodeModules"
import { Compile_Node_Modules } from "./CompileModules"
import { JSXTransformersBefore } from "./Transpiler/JSX/index"


const { __compilerOptions, __Host, __RunDirName, __ModuleUrlPath, __requestsThreshold } = App
const { resetFilesThree } = __Host

let resetModules = true;
let oldProgram;
export const CompileFile = (FilePath, HTMLFilePaths) => {
    const outFile = path.relative(__RunDirName, FilePath),
        __Import_Module_Name = getImportModuleName(),
        __Module_Window_Name = getModuleWindowName(),
        REQUEST_PATH = ("./" + outFile).replace(/(^[\.\.\/]+)|(\/+)/g, "/"),
        MAP_REQUEST_PATH = REQUEST_PATH + ".map"

    const compilerOptions = {
        ...__compilerOptions,
        inlineSources: true,
        outFile,
        __Module_Window_Name,
        rootDir: __RunDirName,
        __Import_Module_Name,
        resetModuleFiles: () => { resetModules = true },
        __Url_Dir_Path: path.dirname(REQUEST_PATH)
    }

    const transformers = getTransformersObject([ModuleTransformersBefore, JSXTransformersBefore], [ModuleTransformersAfter])
    oldProgram = createProgram(
        [FilePath],
        compilerOptions,
        __Host,
        oldProgram
    );




    oldProgram.emit(
        undefined /*sourceFile*/,
        (fileName, content) => {

            console.log({ fileName, REQUEST_PATH })
            const ext = path.extname(fileName)
            if (ext === ".map") {
                __requestsThreshold.set(MAP_REQUEST_PATH, content)
                // console.log(content)
            } else if (ext === ".js") {
                const Module_Text = `(function(${__Import_Module_Name}){${content} \n return ${__Import_Module_Name}; })(window.${__Module_Window_Name}={})\n//# sourceMappingURL=${MAP_REQUEST_PATH}`
                __requestsThreshold.set(REQUEST_PATH, Module_Text)
            }
        }
        // undefined
        /*writeFileCallback*/,
        undefined /*cancellationToken*/,
        undefined /*emitOnlyDtsFiles*/,
        transformers /*transformers*/
    )

    const Modules = new Set([resolveModule("kix", __RunDirName)])
    for (const ModuleFilePath of HTMLFilePaths) {
        getModuleFiles(ModulesThree.get(ModuleFilePath), Modules)
    }

    if (resetModules) {
        resetModules = false
        Compile_Node_Modules(
            [...Modules],
            compilerOptions
        )

    }

    resetFilesThree(oldProgram.getFilesByNameMap())
}
































export const Compile_Node_Modules = (NodeModuelsPaths, compilerOptions) => {
    const transformers = getTransformersObject([ModuleTransformersBefore, NodeModuleTransformersBefore], [ModuleTransformersAfter]),
        __Module_Window_Name = compilerOptions.__Node_Module_Window_Name;

    oldProgram = createProgram(NodeModuelsPaths,
        {
            ...compilerOptions,
            outFile: __ModuleUrlPath,
            removeComments: true,
            sourceMap: false,
            __Module_Window_Name,
            resetModuleFiles: () => { },
        },
        {
            ...__Host,
            resolveModuleNames: (moduleNames, containingFile, reusedNames, redirectedReference) => {
                // console.log(containingFile)
                return moduleNames.map((ModuleText) => {
                    const modulePath = resolve.sync(ModuleText, {
                        basedir: path.dirname(containingFile),
                        extensions: ['.js', '.ts'],
                    })
                    // console.log(modulePath)
                    return {
                        resolvedFileName: modulePath,
                        originalPath: undefined,
                        extension: path.extname(modulePath),
                        isExternalLibraryImport: false,
                        packageId: undefined
                    }
                })
            }
        },
        oldProgram
    );
    oldProgram.emit(
        undefined /*sourceFile*/,
        (fileName, content) => {

            if (path.extname(fileName) == ".js") {
                __requestsThreshold.set(
                    __ModuleUrlPath,
                    `(function(${compilerOptions.__Import_Module_Name}){${content} \n return ${compilerOptions.__Import_Module_Name};})((window.${__Module_Window_Name}={}))`
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
import {
    ScriptKind,
    createPrinter,
    parseConfigFileTextToJson,
    createSourceFile,
    createCompilerHost,
    SyntaxKind,
    visitEachChild,
    resolveModuleName,
    createGetCanonicalFileName,
    createModuleResolutionCache,
    Debug,
    loadWithLocalCache
} from "typescript"
import fs, {
    readFileSync,
    existsSync
} from "fs"
import { transpilers } from "../init/Compiler/Transpiler/Module"
import path from "path/posix"
import { App } from "../init/App"
import tsModule from 'typescript/lib/tsserverlibrary';

export const deepAssign = (target, ...sources) => {
    for (const source of sources) {
        for (let k in source) {
            let vs = source[k],
                vt = target[k]
            if (Object(vs) == vs && Object(vt) === vt) {
                target[k] = deepAssign(vt, vs)
                continue
            }
            target[k] = source[k]
        }
    }
    return target
}
var Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
export const getColumnName = (i) => {
    var l = Chars.length,
        p = i >= l ? getColumnName(Math.floor(i / l) - 1) : "",
        ls = Chars[i % l];
    return p + ls;
};




export const createHost = (__compilerOptions) => {
    let FilesThree = new Map();
    const getSourceFileByExtName = (fileName, languageVersion) => {

        console.log("🚀 getSourceFileByExtName ---> fileName", fileName)
        switch (path.extname(fileName).toLocaleLowerCase()) {
            case ".ts":
            case ".tsx":
            case ".js":
            case ".jsx":
            case ".json":
                return createSourceFile(fileName, readFileSync(fileName, "utf-8"), languageVersion, true)
            case ".scss":
            case ".css":
                return createSourceFile(fileName, `
                 var sfsdfs = 2
                export { sfsdfs };
                export default "44444";
                `, languageVersion, true)
            // default
        }
    }
    const isCssRegex = /\.(((c|le|sa|sc)ss)|styl)$/,
        _HOST = createCompilerHost(__compilerOptions, true),
        currentDirectory = _HOST.getCurrentDirectory(),
        getCanonicalFileName = createGetCanonicalFileName(_HOST.useCaseSensitiveFileNames()),
        moduleResolutionCache = createModuleResolutionCache(currentDirectory, getCanonicalFileName),
        Module_loader = function (moduleName, containingFile, redirectedReference) {


            if (isCssRegex.test(moduleName)) {
                return {
                    extension: tsModule.Extension.Js,
                    isExternalLibraryImport: false,
                    resolvedFileName: path.join(
                        path.dirname(containingFile),
                        moduleName,
                    ),
                };
            }
            return resolveModuleName(moduleName, containingFile, __compilerOptions, Host, moduleResolutionCache, redirectedReference).resolvedModule;
        },
        Host = Object.assign(_HOST, {
            getSourceFile: (fileName, languageVersion) => {
                if (existsSync(fileName)) {

                    return FilesThree.get(fileName) || getSourceFileByExtName(fileName, languageVersion)
                }
            },
            resolveModuleNames: function (moduleNames, containingFile, _reusedNames, redirectedReference) {
                // console.log({ resolved: loadWithLocalCache(Debug.checkEachDefined(moduleNames), containingFile, redirectedReference, Module_loader) })
                return loadWithLocalCache(Debug.checkEachDefined(moduleNames), containingFile, redirectedReference, Module_loader);
            },
            resetFilesThree: (newFilesMap) => (FilesThree = new Map([...FilesThree, ...newFilesMap]))
        })

    return Host

}


export const parseJsonFile = (fileName) => {
    return fs.existsSync(fileName) ? parseConfigFileTextToJson(fileName, readFileSync(fileName, "utf8")).config : {}
}



export const getImportModuleName = () => `________KIX__IMPORT__MODULE__${new Date().getTime()}__`



export const getModuleFiles = (Module, ModuleFiles) => {
    for (const MODULE_PATH in Module.NodeModules) {
        ModuleFiles.add(MODULE_PATH)
    }
    for (const LocalModulesPathKey in Module.LocalModules) {
        getModuleFiles(Module.LocalModules[LocalModulesPathKey], ModuleFiles)
    }
}

let ModuleUnnesesaryIndex = 0;
export const getModuleWindowName = () => {
    return `_KIX${++ModuleUnnesesaryIndex}${new Date().getTime()}`
}
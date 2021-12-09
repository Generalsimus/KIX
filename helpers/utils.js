import {
    parseConfigFileTextToJson,
    createSourceFile,
    createCompilerHost,
    resolveModuleName,
    createGetCanonicalFileName,
    createModuleResolutionCache,
    Debug,
    loadWithLocalCache,
    normalizeSlashes
} from "typescript"
import fs, {
    readFileSync,
    existsSync
} from "fs"
import path from "path"
import tsModule from 'typescript/lib/tsserverlibrary';
import createCssSourceFile from "./createCssSourceFile"
import resolve from "resolve"

export const deepAssign = (target, ...sources) => {
    for (let source of sources) {
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === "object") {
                    target[key] = deepAssign(target[key] || {}, source[key]);
                } else {
                    target[key] = source[key];
                }
            }
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



export let FilesThree = new Map();
export const createHost = (__compilerOptions) => {

    const getSourceFileByExtName = (fileName, languageVersion) => {

        // console.log("🚀 getSourceFileByExtName ---> fileName", fileName)
        switch (path.extname(fileName).toLocaleLowerCase()) {
            case ".ts":
            case ".tsx":
            case ".js":
            case ".jsx":
            case ".json":
                return createSourceFile(fileName, readFileSync(fileName, "utf-8"), languageVersion, true);
            case ".scss":
            case ".css":

                return createCssSourceFile(fileName, readFileSync(fileName, "utf-8"), languageVersion)
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
                    extension: tsModule.Extension.Dts,
                    isExternalLibraryImport: false,
                    resolvedFileName: normalizeSlashes(path.join(
                        path.dirname(containingFile),
                        moduleName,
                    )),
                };
            }
            return resolveModuleName(moduleName, containingFile, __compilerOptions, Host, moduleResolutionCache, redirectedReference).resolvedModule;
        },
        Host = Object.assign(_HOST, {
            getSourceFile: (fileName, languageVersion) => {
                if (existsSync(fileName)) {
                    // let sourceFile = FilesThree.get(fileName)
                    // if (sourceFile) {
                    //     return sourceFile
                    //     // FilesThree.set(fileName,sourceFile)
                    // }
                    // sourceFile = getSourceFileByExtName(fileName, languageVersion)
                    // return FilesThree.set(fileName, sourceFile), sourceFile

                    return FilesThree.get(fileName.toLowerCase()) || getSourceFileByExtName(fileName, languageVersion)
                }
            },
            resolveModuleNames: function (moduleNames, containingFile, _reusedNames, redirectedReference) {

                return loadWithLocalCache(Debug.checkEachDefined(moduleNames), containingFile, redirectedReference, Module_loader);
            },
            resetFilesThree: (newFilesMap) => (FilesThree = new Map([...FilesThree, ...newFilesMap])),
            deleteFileinThree: (filesThreeLocationPath) => (FilesThree.delete(filesThreeLocationPath)),
            // getDefaultLibLocation: () => normalizeSlashes(path.resolve(__dirname + "./../../lib")),

        })

    return Host

}

export const fixLibFileLocationInCompilerOptions = (compilerOptions, host) => {
    const defaultLibFileName = host.getDefaultLibFileName(compilerOptions);
    const libDirectory = path.dirname(defaultLibFileName)
    // const libDirectory = normalizeSlashes(path.resolve(__dirname + "./../lib"))
    const newLibs = new Set([defaultLibFileName, normalizeSlashes(path.join(__dirname, "../../kix.lib.d.ts"))])

    if (compilerOptions.lib) {
        for (const libKey in compilerOptions.lib) {
            const lib = compilerOptions.lib[libKey]
            const libFilePath = path.join(libDirectory, `./lib.${lib.toLowerCase()}.d.ts`)
            // console.log("🚀 --> file: utils.js --> line 127 --> fixLibFileLocationInCompilerOptions --> libFilePath", libFilePath)
            if (fs.existsSync(libFilePath)) {
                newLibs.add(normalizeSlashes(libFilePath))
            }
        }
    } else {
        newLibs.add(defaultLibFileName)
    }

    compilerOptions.lib = [...newLibs]
    // console.log("🚀 --> file: utils.js --> line 136 --> fixLibFileLocationInCompilerOptions --> compilerOptions.lib", compilerOptions.lib)
    // compilerOptions.lib = undefined
    // console.log("🚀 --> file: utils.js --> line 136 --> fixLibFileLocationInCompilerOptions --> compilerOptions.lib", compilerOptions.lib)
    return compilerOptions
}

// "../../../node_modules/typescript/lib"
// import sss from 
export const parseJsonFile = (fileName) => {
    return fs.existsSync(fileName) ? parseConfigFileTextToJson(fileName, readFileSync(fileName, "utf8")).config : {}
}



export const getImportModuleName = () => `________KIX__IMPORT__MODULE__${new Date().getTime()}__`



export const getModuleFiles = (Module, ModuleFiles, parsedPaths = new Set()) => {

    for (const MODULE_PATH in Module.NodeModules) {
        ModuleFiles.add(MODULE_PATH)
    }
    for (const LocalModulesPathKey in Module.LocalModules) {
        if (!parsedPaths.has(LocalModulesPathKey)) {
            parsedPaths.add(LocalModulesPathKey)
            getModuleFiles(Module.LocalModules[LocalModulesPathKey], ModuleFiles, parsedPaths)
        }
    }
}

let ModuleUnnesesaryIndex = 0;
export const getModuleWindowName = () => {
    return `_KIX${++ModuleUnnesesaryIndex}${new Date().getTime()}`
}














export const createCancellationToken = () => {
    let requesteCancell = false
    return {
        isCancellationRequested: () => { return requesteCancell },
        throwIfCancellationRequested: () => { },
        requesteCancell: () => { requesteCancell = true },
    }
}



export const filePathToUrl = (filePath) => {

    return ("./" + filePath).replace(/(^[\.\.\/]+)|([\\]+)/g, "/")
    // return ("./" + filePath).replace(/(^[\.\.\/]+)|(\/+)/g, "\\")
}


export const resolveKixModule = (fileDirectory) => {
    try {
        return normalizeSlashes(resolve.sync("kix", {
            basedir: fileDirectory,
            extensions: ['.js', '.ts', '.jsx', '.tsx'],
        }))
    } catch {
        return
    }
}









export const getoutFilePath = (filePath) => {
    return filePath.replace(/\.tsx?$/, new Date().getTime() + ".js")
}
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
import { App } from "../init/App";

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
        _HOST = createCompilerHost(__compilerOptions, /* setParentNodes */  true),
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

                    const fff = FilesThree.get(fileName.toLowerCase()) || getSourceFileByExtName(fileName, languageVersion)
                    // console.log("🚀 --> file: utils.js --> line 97 --> createHost --> fff", fff.imports)

                    return fff
                }
            },
            resolveModuleNames: function (moduleNames, containingFile, _reusedNames, redirectedReference) {

                return loadWithLocalCache(Debug.checkEachDefined(moduleNames), containingFile, redirectedReference, Module_loader);
            },
            resetFilesThree: (newFilesMap) => (FilesThree = new Map([...FilesThree, ...newFilesMap])),
            deleteFileinThree: (filesThreeLocationPath) => (FilesThree.delete(filesThreeLocationPath)),
            // getDefaultLibLocation: () => normalizeSlashes(path.resolve(__dirname + "./../../lib")),

        })


    // console.log("🚀 --> file: utils.js --> line 115 --> createHost --> Host", Host)

    return Host

}

export const fixLibFileLocationInCompilerOptions = (compilerOptions, host) => {
    const defaultLibFileName = host.getDefaultLibFileName(compilerOptions);
    const libDirectory = path.dirname(defaultLibFileName)

    const newLibs = new Set([defaultLibFileName, normalizeSlashes(path.join(__dirname, "../../main/index.d.ts"))])


    if (compilerOptions.lib) {
        for (const libKey in compilerOptions.lib) {
            const lib = compilerOptions.lib[libKey]
            const libFilePath = path.join(libDirectory, `./lib.${lib.toLowerCase()}.d.ts`)

            if (fs.existsSync(libFilePath)) {
                newLibs.add(normalizeSlashes(libFilePath))
            }
        }
    } else {
        newLibs.add(defaultLibFileName)
    }

    compilerOptions.lib = [...newLibs]

    return compilerOptions
}

// "../../../node_modules/typescript/lib"
// import sss from 
export const parseJsonFile = (fileName) => {
    return fs.existsSync(fileName) ? parseConfigFileTextToJson(fileName, readFileSync(fileName, "utf8")).config : {}
}



export const getImportModuleName = () => `________KIX__IMPORT__MODULE__${new Date().getTime()}__`



export const getModuleFiles = (moduleInfo, moduleFiles, parsedPaths = new Set()) => {

    if (!parsedPaths.has(moduleInfo.modulePath)) {
        parsedPaths.add(moduleInfo.modulePath)

        for (const importPath in moduleInfo.moduleColection) {
            const importModuleInfo = moduleInfo.moduleColection[importPath];
            // console.log("🚀 --> file: utils.js --> line 157 --> getModuleFiles --> importPath", importPath)

            if (importModuleInfo.isNodeModule) {
                moduleFiles.add(importModuleInfo.modulePath)

            } else {
                getModuleFiles(importModuleInfo, moduleFiles, parsedPaths)
            }
        }
    }


    return moduleFiles;
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
        const location = normalizeSlashes(path.join(__dirname, "../../main/index.js"))
        return fs.existsSync(location) && location
    }
}









export const getoutFilePath = (filePath) => {
    return filePath.replace(/\.tsx?$/, new Date().getTime() + ".js")
}








export const getScriptTagInfos = (document, window) => {
    const { __compilerOptions, __Host, __RunDirName } = App
    const compilerOptions = fixLibFileLocationInCompilerOptions(__compilerOptions, __Host)

    const htmlFiles = new Set();

    return {
        scriptTagInfos: Array.prototype.map.call(document.querySelectorAll('script[lang="kix"]'), (scriptElement, index) => {
            scriptElement.removeAttribute("lang");
            const ulrMeta = new window.URL(scriptElement.src, 'http://e'),
                filePath = normalizeSlashes(path.join(__RunDirName, decodeURIComponent(ulrMeta.pathname))),
                outFile = getoutFilePath(path.relative(__RunDirName, filePath));
            if (htmlFiles.has(filePath)) {
                scriptElement.remove()
                return;
            }
            htmlFiles.add(filePath);
            scriptElement.setAttribute("src", filePathToUrl(outFile));

            return {
                filePath,
                compilerOptions: { ...compilerOptions, outFile }
            }
        }),
        indexHtmlMainFilePaths: [...htmlFiles]
    }
}




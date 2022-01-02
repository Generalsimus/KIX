"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScriptTagInfos = exports.getoutFilePath = exports.resolveKixModule = exports.filePathToUrl = exports.createCancellationToken = exports.getModuleWindowName = exports.getModuleFiles = exports.getImportModuleName = exports.parseJsonFile = exports.fixLibFileLocationInCompilerOptions = exports.createHost = exports.FilesThree = exports.getColumnName = exports.deepAssign = void 0;
const typescript_1 = require("typescript");
const fs_1 = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const tsserverlibrary_1 = __importDefault(require("typescript/lib/tsserverlibrary"));
const createCssSourceFile_1 = __importDefault(require("./createCssSourceFile"));
const resolve_1 = __importDefault(require("resolve"));
const App_1 = require("../init/App");
const deepAssign = (target, ...sources) => {
    for (let source of sources) {
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === "object") {
                    target[key] = (0, exports.deepAssign)(target[key] || {}, source[key]);
                }
                else {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
};
exports.deepAssign = deepAssign;
var Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const getColumnName = (i) => {
    var l = Chars.length, p = i >= l ? (0, exports.getColumnName)(Math.floor(i / l) - 1) : "", ls = Chars[i % l];
    return p + ls;
};
exports.getColumnName = getColumnName;
exports.FilesThree = new Map();
const createHost = (__compilerOptions) => {
    const getSourceFileByExtName = (fileName, languageVersion) => {
        switch (path_1.default.extname(fileName).toLocaleLowerCase()) {
            case ".ts":
            case ".tsx":
            case ".js":
            case ".jsx":
            case ".json":
                return (0, typescript_1.createSourceFile)(fileName, (0, fs_1.readFileSync)(fileName, "utf-8"), languageVersion, true);
            case ".scss":
            case ".css":
                return (0, createCssSourceFile_1.default)(fileName, (0, fs_1.readFileSync)(fileName, "utf-8"), languageVersion);
        }
    };
    const isCssRegex = /\.(((c|le|sa|sc)ss)|styl)$/, _HOST = (0, typescript_1.createCompilerHost)(__compilerOptions, true), currentDirectory = _HOST.getCurrentDirectory(), getCanonicalFileName = (0, typescript_1.createGetCanonicalFileName)(_HOST.useCaseSensitiveFileNames()), moduleResolutionCache = (0, typescript_1.createModuleResolutionCache)(currentDirectory, getCanonicalFileName), Module_loader = function (moduleName, containingFile, redirectedReference) {
        if (isCssRegex.test(moduleName)) {
            return {
                extension: tsserverlibrary_1.default.Extension.Dts,
                isExternalLibraryImport: false,
                resolvedFileName: (0, typescript_1.normalizeSlashes)(path_1.default.join(path_1.default.dirname(containingFile), moduleName)),
            };
        }
        return (0, typescript_1.resolveModuleName)(moduleName, containingFile, __compilerOptions, Host, moduleResolutionCache, redirectedReference).resolvedModule;
    }, Host = Object.assign(_HOST, {
        getSourceFile: (fileName, languageVersion) => {
            if ((0, fs_1.existsSync)(fileName)) {
                const fff = exports.FilesThree.get(fileName.toLowerCase()) || getSourceFileByExtName(fileName, languageVersion);
                return fff;
            }
        },
        resolveModuleNames: function (moduleNames, containingFile, _reusedNames, redirectedReference) {
            return (0, typescript_1.loadWithLocalCache)(typescript_1.Debug.checkEachDefined(moduleNames), containingFile, redirectedReference, Module_loader);
        },
        resetFilesThree: (newFilesMap) => (exports.FilesThree = new Map([...exports.FilesThree, ...newFilesMap])),
        deleteFileinThree: (filesThreeLocationPath) => (exports.FilesThree.delete(filesThreeLocationPath)),
    });
    return Host;
};
exports.createHost = createHost;
const fixLibFileLocationInCompilerOptions = (compilerOptions, host) => {
    const defaultLibFileName = host.getDefaultLibFileName(compilerOptions);
    const libDirectory = path_1.default.dirname(defaultLibFileName);
    const newLibs = new Set([defaultLibFileName, (0, typescript_1.normalizeSlashes)(path_1.default.join(__dirname, "../../main/index.d.ts"))]);
    if (compilerOptions.lib) {
        for (const libKey in compilerOptions.lib) {
            const lib = compilerOptions.lib[libKey];
            const libFilePath = path_1.default.join(libDirectory, `./lib.${lib.toLowerCase()}.d.ts`);
            if (fs_1.default.existsSync(libFilePath)) {
                newLibs.add((0, typescript_1.normalizeSlashes)(libFilePath));
            }
        }
    }
    else {
        newLibs.add(defaultLibFileName);
    }
    compilerOptions.lib = [...newLibs];
    return compilerOptions;
};
exports.fixLibFileLocationInCompilerOptions = fixLibFileLocationInCompilerOptions;
const parseJsonFile = (fileName) => {
    return fs_1.default.existsSync(fileName) ? (0, typescript_1.parseConfigFileTextToJson)(fileName, (0, fs_1.readFileSync)(fileName, "utf8")).config : {};
};
exports.parseJsonFile = parseJsonFile;
const getImportModuleName = () => `________KIX__IMPORT__MODULE__${new Date().getTime()}__`;
exports.getImportModuleName = getImportModuleName;
const getModuleFiles = (moduleInfo, moduleFiles, parsedPaths = new Set()) => {
    if (!parsedPaths.has(moduleInfo.modulePath)) {
        parsedPaths.add(moduleInfo.modulePath);
        for (const importPath in moduleInfo.moduleColection) {
            const importModuleInfo = moduleInfo.moduleColection[importPath];
            if (importModuleInfo.isNodeModule) {
                moduleFiles.add(importModuleInfo.modulePath);
            }
            else {
                (0, exports.getModuleFiles)(importModuleInfo, moduleFiles, parsedPaths);
            }
        }
    }
    return moduleFiles;
};
exports.getModuleFiles = getModuleFiles;
let ModuleUnnesesaryIndex = 0;
const getModuleWindowName = () => {
    return `_KIX${++ModuleUnnesesaryIndex}${new Date().getTime()}`;
};
exports.getModuleWindowName = getModuleWindowName;
const createCancellationToken = () => {
    let requesteCancell = false;
    return {
        isCancellationRequested: () => { return requesteCancell; },
        throwIfCancellationRequested: () => { },
        requesteCancell: () => { requesteCancell = true; },
    };
};
exports.createCancellationToken = createCancellationToken;
const filePathToUrl = (filePath) => {
    return ("./" + filePath).replace(/(^[\.\.\/]+)|([\\]+)/g, "/");
};
exports.filePathToUrl = filePathToUrl;
const resolveKixModule = (fileDirectory) => {
    try {
        return (0, typescript_1.normalizeSlashes)(resolve_1.default.sync("kix", {
            basedir: fileDirectory,
            extensions: ['.js', '.ts', '.jsx', '.tsx'],
        }));
    }
    catch {
        const location = (0, typescript_1.normalizeSlashes)(path_1.default.join(__dirname, "../../main/index.js"));
        return fs_1.default.existsSync(location) && location;
    }
};
exports.resolveKixModule = resolveKixModule;
const getoutFilePath = (filePath) => {
    return filePath.replace(/\.tsx?$/, new Date().getTime() + ".js");
};
exports.getoutFilePath = getoutFilePath;
const getScriptTagInfos = (document, window) => {
    const { __compilerOptions, __Host, __RunDirName } = App_1.App;
    const compilerOptions = (0, exports.fixLibFileLocationInCompilerOptions)(__compilerOptions, __Host);
    const htmlFiles = new Set();
    return {
        scriptTagInfos: Array.prototype.map.call(document.querySelectorAll('script[lang="kix"]'), (scriptElement, index) => {
            scriptElement.removeAttribute("lang");
            const ulrMeta = new window.URL(scriptElement.src, 'http://e'), filePath = (0, typescript_1.normalizeSlashes)(path_1.default.join(__RunDirName, decodeURIComponent(ulrMeta.pathname))), outFile = (0, exports.filePathToUrl)((0, exports.getoutFilePath)(path_1.default.relative(__RunDirName, filePath)));
            if (htmlFiles.has(filePath)) {
                scriptElement.remove();
                return;
            }
            htmlFiles.add(filePath);
            scriptElement.setAttribute("src", outFile);
            return {
                filePath,
                compilerOptions: { ...compilerOptions, outFile }
            };
        }),
        indexHtmlMainFilePaths: [...htmlFiles]
    };
};
exports.getScriptTagInfos = getScriptTagInfos;
